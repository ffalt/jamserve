import {ID3v1, ID3v2, IID3V1, IID3V2, IMP3, MP3, simplifyTag} from 'jamp3';
import {ChartLyricsClient, ChartLyricsResult} from './clients/chartlyrics-client';
import {AcoustidClient} from './clients/acoustid-client';
import {LastFMClient} from './clients/lastfm-client';
import {MusicbrainzClient} from './clients/musicbrainz-client';
import {MusicbrainzClientApi} from './clients/musicbrainz-client.interface';
import {LastFM} from '../../model/lastfm-rest-data';
import {Acoustid} from '../../model/acoustid-rest-data';
import {MusicBrainz} from '../../model/musicbrainz-rest-data';
import {fileSuffix} from '../../utils/fs-utils';
import {cleanGenre} from '../../utils/genres';
import {Jam} from '../../model/jam-rest-data';
import {TrackMedia, TrackTag} from '../../objects/track/track.model';
import {MetaInfoAlbum, MetaInfoArtist, MetaInfoImage, MetaInfoTopSong, MetaInfoTrackSimilarSong} from './metadata.model';
import {Folder} from '../../objects/folder/folder.model';
import fse from 'fs-extra';
import {ThirdpartyToolsConfig} from '../../config/thirdparty.config';
import {probe, ProbeResult} from './tools/ffprobe';
import {ID3v1_GENRES} from 'jamp3/dist/lib/id3v1/id3v1_consts';
import {AcousticbrainzClient} from './clients/acousticbrainz-client';
import {AcousticBrainz} from '../../model/acousticbrainz-rest-data';

export interface AudioScanResult {
	media?: TrackMedia;
	tag?: TrackTag;
}

export class FORMAT {
	static packJamServeMedia(data?: IMP3.MPEG): TrackMedia {
		if (!data) {
			return {};
		}
		return {
			format: 'mp3',
			duration: data.durationEstimate,
			bitRate: data.bitRate,
			sampleRate: data.sampleRate,
			channels: data.channels,
			encoded: data.encoded,
			mode: data.mode,
			version: data.version + ' ' + data.layer
		};
	}

	static packProbeJamServeMedia(data: ProbeResult): TrackMedia {
		if (!data.streams) {
			return {};
		}
		const stream = data.streams.filter(s => s.codec_type === 'audio')[0];
		if (!stream) {
			return {};
		}
		return {
			format: data.format.format_name,
			duration: Number(data.format.duration),
			bitRate: Number(data.format.bit_rate),
			sampleRate: Number(stream.sample_rate),
			channels: stream.channels,
			mode: stream.channel_layout,
			version: stream.codec_long_name
		};
	}

	static packProbeJamServeTag(data: ProbeResult): TrackTag {
		const simple = data.format.tags;
		if (!simple) {
			return {};
		}
		const track = Number(simple.track);
		const year = Number(simple.DATE);
		const disc = Number(simple.disc);
		return {
			artist: simple.ARTIST,
			title: simple.TITLE,
			album: simple.ALBUM,
			year: isNaN(year) ? undefined : year,
			track: isNaN(track) ? undefined : track,
			disc: isNaN(disc) ? undefined : disc,
			genre: simple.GENRE ? cleanGenre(simple.GENRE) : undefined,
			albumArtist: simple.album_artist || simple['ALBUM ARTIST'],
			albumSort: simple.album_sort_order,
			albumArtistSort: simple.album_artist_sort || simple.album_artist_sort_order,
			artistSort: simple.artist_sort,
			titleSort: simple.title_sort_order,
			mbTrackID: simple.TRACKID,
			mbAlbumType: simple.ALBUMTYPE,
			mbAlbumArtistID: simple.ALBUMARTISTID,
			mbArtistID: simple.ARTISTID,
			mbAlbumID: simple.ALBUMID,
			mbReleaseTrackID: simple.RELEASETRACKID,
			mbReleaseGroupID: simple.RELEASEGROUPID,
			mbRecordingID: simple.RECORDINGID,
			mbAlbumStatus: simple.ALBUMSTATUS,
			mbReleaseCountry: simple.RELEASECOUNTRY
		};
	}

	static packID3v1JamServeTag(data?: IID3V1.Tag): TrackTag | undefined {
		if (!data) {
			return undefined;
		}
		const simple = data.value;
		return {
			artist: simple.artist,
			title: simple.title,
			album: simple.album,
			year: isNaN(Number(simple.year)) ? undefined : Number(simple.year),
			track: simple.track,
			genre: (simple.genreIndex !== undefined && !!ID3v1_GENRES[simple.genreIndex]) ? ID3v1_GENRES[simple.genreIndex] : undefined,
		};
	}

	static packID3v2JamServeTag(data?: IID3V2.Tag): TrackTag | undefined {
		if (!data) {
			return undefined;
		}
		const simple = simplifyTag(data);
		// ? simplifyTag(result.id3v2) : undefined
		let year: number | undefined = simple.year;
		if (simple.release_year) {
			const y = Number(simple.release_year);
			if (!isNaN(y)) {
				year = y;
			}
		}
		if (simple.originalyear) {
			const y = Number(simple.originalyear);
			if (!isNaN(y)) {
				year = y;
			}
		}
		if (simple.original_release_year) {
			const y = Number(simple.original_release_year);
			if (!isNaN(y)) {
				year = y;
			}
		}
		if (simple.release_date) {
			const y = parseInt(simple.release_date.slice(0, 4), 10);
			if (!isNaN(y)) {
				year = y;
			}
		}
		return {
			album: simple.album,
			albumSort: simple.album_sort_order,
			albumArtist: simple.album_artist,
			albumArtistSort: simple.album_artist_sort || simple.album_artist_sort_order,
			artist: simple.artist,
			artistSort: simple.artist_sort,
			genre: simple.genre ? cleanGenre(simple.genre) : undefined,
			disc: simple.disc,
			title: simple.title,
			titleSort: simple.title_sort_order,
			track: simple.track,
			year: year,
			mbTrackID: simple.TRACKID,
			mbAlbumType: simple.ALBUMTYPE,
			mbAlbumArtistID: simple.ALBUMARTISTID,
			mbArtistID: simple.ARTISTID,
			mbAlbumID: simple.ALBUMID,
			mbReleaseTrackID: simple.RELEASETRACKID,
			mbReleaseGroupID: simple.RELEASEGROUPID,
			mbRecordingID: simple.RECORDINGID,
			mbAlbumStatus: simple.ALBUMSTATUS,
			mbReleaseCountry: simple.RELEASECOUNTRY
		};
	}

	static packMediaInfoImage(images: Array<LastFM.Image>): MetaInfoImage {
		let small: string | undefined;
		let medium: string | undefined;
		let large: string | undefined;
		let image = (images || []).find(img => img.size === 'small');
		if (image && image.url && image.url.length > 0) {
			small = image.url;
		}
		image = (images || []).find(img => img.size === 'medium');
		if (image && image.url && image.url.length > 0) {
			medium = image.url;
		}
		image = (images || []).find(img => img.size === 'large');
		if (image && image.url && image.url.length > 0) {
			large = image.url;
		}
		return {
			small: small,
			medium: medium,
			large: large
		};
	}

	static packMediaInfoArtist(data?: LastFM.Artist): MetaInfoArtist | undefined {
		if (!data) {
			return;
		}
		if (!data.mbid) {
			return;
		}
		return {
			name: data.name,
			mbid: data.mbid,
			url: data.url,
			image: this.packMediaInfoImage(data.image),
			tags: data.tags,
			description: data.bio ? data.bio.content : undefined,
			similar: data.similar && data.similar.artist ? data.similar.artist.map(artist => {
				return {
					name: artist.name,
					url: artist.url,
					image: this.packMediaInfoImage(artist.image)
				};
			}) : undefined
		};
	}

	static packMediaInfoSimilarSong(data?: LastFM.SimilarTracks): Array<MetaInfoTrackSimilarSong> {
		if (!data || !data.track || data.track.length === 0) {
			return [];
		}
		return data.track.map(t => {
			return {
				name: t.name,
				mbid: t.mbid,
				url: t.url,
				duration: parseFloat(t.duration),
				artist: {
					name: t.artist.name,
					mbid: t.artist.mbid,
					url: t.artist.name
				},
				image: this.packMediaInfoImage(t.image)
			};
		});
	}

	static packMediaInfoAlbum(data?: LastFM.Album): MetaInfoAlbum | undefined {
		if (!data) {
			return;
		}
		return {
			name: data.name,
			artist: data.artist,
			mbid: data.mbid,
			url: data.url,
			image: this.packMediaInfoImage(data.image),
			tags: data.tags,
			description: data.wiki ? data.wiki.content : undefined
		};
	}

	static packMediaInfoTopSongs(data?: LastFM.TopTracks): Array<MetaInfoTopSong> {
		if (!data || !data.track || data.track.length === 0) {
			return [];
		}
		return data.track.map(t => {
			return {
				name: t.name,
				mbid: t.mbid,
				url: t.url,
				rank: t.rank,
				artist: {
					name: t.artist.name,
					mbid: t.artist.mbid,
					url: t.artist.name
				},
				image: this.packMediaInfoImage(t.image)
			};
		});
	}
}

export class AudioModule {
	musicbrainz: MusicbrainzClient;
	acoustid: AcoustidClient;
	lastFM: LastFMClient;
	chartLyrics: ChartLyricsClient;
	acousticbrainz: AcousticbrainzClient;
	private isSaving: { [filename: string]: boolean } = {};

	constructor(tools: ThirdpartyToolsConfig) {
		this.musicbrainz = new MusicbrainzClient({userAgent: tools.musicbrainz.userAgent, retryOn: true});
		this.acousticbrainz = new AcousticbrainzClient({userAgent: tools.acousticbrainz.userAgent, retryOn: true});
		this.lastFM = new LastFMClient({key: tools.lastfm.apiKey, userAgent: tools.lastfm.userAgent});
		this.acoustid = new AcoustidClient({key: tools.acoustid.apiKey, userAgent: tools.acoustid.userAgent});
		this.chartLyrics = new ChartLyricsClient(tools.chartlyrics.userAgent);
	}

	async read(filename: string): Promise<AudioScanResult> {
		const suffix = fileSuffix(filename);
		if (suffix === 'mp3') {
			const mp3 = new MP3();
			try {
				const result = await mp3.read({filename, mpegQuick: true, mpeg: true, id3v2: true});
				if (!result) {
					return {tag: {}, media: {}};
				} else {
					if (result.id3v2) {
						return {tag: FORMAT.packID3v2JamServeTag(result.id3v2), media: FORMAT.packJamServeMedia(result.mpeg)};
					}
					const id3v1 = new ID3v1();
					const v1 = await id3v1.read(filename);
					if (!v1) {
						return {tag: {}, media: FORMAT.packJamServeMedia(result.mpeg)};
					}
					return {tag: FORMAT.packID3v1JamServeTag(v1), media: FORMAT.packJamServeMedia(result.mpeg)};
				}
			} catch (e) {
				console.error(e);
				return {tag: {}, media: {}};
			}
		} else {
			const p = await probe(filename, []);
			if (!p) {
				return {tag: {}, media: {}};
			} else {
				return {tag: FORMAT.packProbeJamServeTag(p), media: FORMAT.packProbeJamServeMedia(p)};
			}
		}
	}

	async saveID3v2(filename: string, tag: Jam.ID3Tag): Promise<void> {
		if (this.isSaving[filename]) {
			console.error('Another save is in progress', filename);
			return Promise.reject(Error('Another save is in progress'));
		}
		this.isSaving[filename] = true;
		try {
			const exists = await fse.pathExists(filename + '.bak.org');
			if (!exists) {
				await fse.copy(filename, filename + '.bak.org');
			}
			const frames: Array<IID3V2.Frame> = [];
			Object.keys(tag.frames).map(id => {
				const f = tag.frames[id] || [];
				f.forEach(value => {
					frames.push({id, head: {statusFlags: {}, formatFlags: {}, size: 0}, value});
				});
				return;
			});
			const t: IID3V2.Tag = {
				id: 'ID3v2',
				head: {
					ver: tag.version,
					rev: 0,
					size: 0,
					valid: true
				},
				start: 0,
				end: 0,
				frames
			};
			const id3v2 = new ID3v2();
			await id3v2.write(filename, t, tag.version, 0);
			delete this.isSaving[filename];
		} catch (e) {
			delete this.isSaving[filename];
			return Promise.reject(e);
		}
	}

	async readID3v2(filename: string): Promise<Jam.ID3Tag> {
		const id3v2 = new ID3v2();
		const id3v2tag = await id3v2.read(filename);
		if (!id3v2tag || !id3v2tag.head) {
			return Promise.reject(Error('No ID3v2 Tag found'));
		}
		const tag: Jam.ID3Tag = {
			version: id3v2tag.head.ver,
			frames: {}
		};
		id3v2tag.frames.forEach(frame => {
			const f = tag.frames[frame.id] || [];
			if (frame.value && frame.value.hasOwnProperty('bin')) {
				const binValue = <any>frame.value;
				binValue.bin = binValue.bin.toString('base64');
			}
			f.push(frame.value);
			tag.frames[frame.id] = f;
		});
		return tag;
	}

	async readID3v2Image(filename: string, type: number): Promise<{ buffer?: Buffer, mimeType?: string }> {
		const id3v2 = new ID3v2();
		const tag = await id3v2.read(filename);
		if (!tag) {
			return {};
		}
		const frame = tag.frames.find(f => {
			if (['APIC', 'PIC'].indexOf(f.id) >= 0) {
				return (<IID3V2.FrameValue.Pic>f.value).pictureType === type;
			}
			return false;
		});
		if (!frame) {
			return {};
		}
		return {buffer: (<IID3V2.FrameValue.Pic>frame.value).bin, mimeType: (<IID3V2.FrameValue.Pic>frame.value).mimeType};
	}

	async mediaInfoArtistInfo(artistName: string): Promise<MetaInfoArtist | undefined> {
		const data = await this.lastFM.artist(artistName);
		return FORMAT.packMediaInfoArtist(data);
	}

	async mediaInfoArtistInfoByArtistID(artistID: string): Promise<MetaInfoArtist | undefined> {
		const data = await this.lastFM.artistID(artistID);
		return FORMAT.packMediaInfoArtist(data);
	}

	async mediaInfoAlbumInfo(albumName: string, artistName: string): Promise<MetaInfoAlbum | undefined> {
		const data = await this.lastFM.album(albumName, artistName);
		const result = FORMAT.packMediaInfoAlbum(data);
		if (result && result.mbid) {
			const mb = await this.musicbrainz.lookup({id: result.mbid, type: 'release', inc: 'labels'});
			result.releases = mb.releases;
		}
		return result;
	}

	async mediaInfoAlbumInfoByAlbumID(albumID: string): Promise<MetaInfoAlbum | undefined> {
		const data = await this.lastFM.albumID(albumID);
		const result = FORMAT.packMediaInfoAlbum(data);
		if (result) {
			const mb = await this.musicbrainz.lookup({id: albumID, type: 'release', inc: 'labels'});
			result.releases = mb.releases;
		}
		return result;
	}

	async mediaInfoSimilarTrack(title: string, artist: string): Promise<Array<MetaInfoTrackSimilarSong>> {
		const data = await this.lastFM.similarTrack(title, artist);
		return FORMAT.packMediaInfoSimilarSong(data);
	}

	async mediaInfoSimilarTrackByMBTrackID(trackID: string): Promise<Array<MetaInfoTrackSimilarSong>> {
		const data = await this.lastFM.similarTrackID(trackID);
		return FORMAT.packMediaInfoSimilarSong(data);
	}

	async mediaInfoTopSongs(artistName: string): Promise<Array<MetaInfoTopSong>> {
		// TODO: get more than 50
		const data = await this.lastFM.topArtistSongs(artistName);
		return FORMAT.packMediaInfoTopSongs(data);
	}

	async mediaInfoTopSongsByArtistID(artistID: string): Promise<Array<MetaInfoTopSong>> {
		// TODO: get more than 50
		const data = await this.lastFM.topArtistSongsID(artistID);
		return FORMAT.packMediaInfoTopSongs(data);
	}

	async acoustidLookup(filename: string, includes: string | undefined): Promise<Array<Acoustid.Result>> {
		return this.acoustid.acoustid(filename, includes);
	}

	async musicbrainzSearch(type: string, query: MusicbrainzClientApi.SearchQuery): Promise<MusicBrainz.Response> {
		return this.musicbrainz.search({type: type, query});
	}

	async musicbrainzLookup(type: string, id: string, inc: string | undefined): Promise<MusicBrainz.Response> {
		return this.musicbrainz.lookup({type: type, id, inc});
	}

	async acousticbrainzLookup(id: string, nr: number | undefined): Promise<AcousticBrainz.Response> {
		return this.acousticbrainz.highLevel(id, nr);
	}

	async musicbrainzAlbumByFolder(folder: Folder): Promise<MusicBrainz.Response> {
		const query: MusicbrainzClientApi.SearchQueryRelease = {
			arid: folder.tag.mbArtistID,
			artist: folder.tag.artist,
			release: folder.tag.album || folder.tag.title
		};
		return this.musicbrainz.search({type: 'release', query});
	}

	async lastFMLookup(type: string, id: string): Promise<LastFM.Result> {
		// TODO: get more than 50
		return this.lastFM.lookup(type, id);
	}

	async getLyrics(artist: string, song: string): Promise<ChartLyricsResult | undefined> {
		return this.chartLyrics.search(artist, song);
	}


}
