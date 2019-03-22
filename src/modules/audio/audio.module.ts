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
import {ThirdpartyToolsConfig} from '../../config/thirdparty.config';
import {probe, ProbeResult} from './tools/ffprobe';
import {ID3v1_GENRES} from 'jamp3/dist/lib/id3v1/id3v1_consts';
import {AcousticbrainzClient} from './clients/acousticbrainz-client';
import {AcousticBrainz} from '../../model/acousticbrainz-rest-data';
import {CoverArtArchiveClient} from './clients/coverartarchive-client';
import {CoverArtArchive} from '../../model/coverartarchive-rest-data';
import {AudioFormatType, CoverArtArchiveLookupType, TrackTagFormatType, TrackTagRawFormatTypes} from '../../model/jam-types';
import {WikiData, WikipediaClient} from './clients/wikipedia-client';

export interface AudioScanResult {
	media?: TrackMedia;
	tag?: TrackTag;
}

class FORMAT {
	static packJamServeMedia(data?: IMP3.MPEG): TrackMedia {
		if (!data) {
			return {};
		}
		return {
			format: AudioFormatType.mp3,
			duration: data.durationEstimate,
			bitRate: data.bitRate,
			sampleRate: data.sampleRate,
			channels: data.channels,
			encoded: data.encoded,
			mode: data.mode,
			version: data.version + ' ' + data.layer
		};
	}

	static packProbeJamServeMedia(data: ProbeResult, format: AudioFormatType): TrackMedia {
		if (!data.streams) {
			return {};
		}
		const stream = data.streams.filter(s => s.codec_type === 'audio')[0];
		if (!stream) {
			return {};
		}
		return {
			format,
			duration: Number(data.format.duration),
			bitRate: Number(data.format.bit_rate),
			sampleRate: Number(stream.sample_rate),
			channels: stream.channels,
			mode: stream.channel_layout,
			version: stream.codec_long_name
		};
	}

	static packProbeJamServeTag(data: ProbeResult): TrackTag {
		const simple: { [name: string]: string } = {};
		Object.keys(data.format.tags).forEach(key => {
			simple[key.toUpperCase().replace(/ /g, '_')] = data.format.tags[key];
		});
		if (!simple) {
			return {format: TrackTagFormatType.none};
		}
		const track = Number(simple.TRACK);
		const year = Number(simple.DATE);
		const disc = Number(simple.DISC);
		return {
			format: TrackTagFormatType.ffmpeg,
			artist: simple.ARTIST,
			title: simple.TITLE,
			album: simple.ALBUM,
			year: isNaN(year) ? undefined : year,
			track: isNaN(track) ? undefined : track,
			disc: isNaN(disc) ? undefined : disc,
			genre: simple.GENRE ? cleanGenre(simple.GENRE) : undefined,
			albumArtist: simple.ALBUM_ARTIST,
			albumSort: simple.ALBUM_SORT || simple.ALBUM_SORT_ORDER,
			albumArtistSort: simple.ALBUM_ARTIST_SORT || simple.ALBUM_ARTIST_SORT_ORDER,
			artistSort: simple.ARTIST_SORT || simple.ARTIST_SORT_ORDER,
			titleSort: simple.TITLE_SORT || simple.TITLE_SORT_ORDER,
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
			format: TrackTagFormatType.id3v1,
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
		const format = TrackTagRawFormatTypes[data.head ? data.head.rev : -1] || TrackTagFormatType.none;
		return {
			format,
			album: simple.album,
			albumSort: simple.album_sort_order,
			albumArtist: simple.album_artist,
			albumArtistSort: simple.album_artist_sort || simple.album_artist_sort_order,
			artist: simple.artist,
			artistSort: simple.artist_sort,
			genre: simple.genre ? cleanGenre(simple.genre) : undefined,
			disc: simple.disc,
			discTotal: simple.disc_total,
			title: simple.title,
			titleSort: simple.title_sort_order,
			track: simple.track,
			trackTotal: simple.track_total,
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

}

export class AudioModule {
	musicbrainz: MusicbrainzClient;
	acoustid: AcoustidClient;
	lastFM: LastFMClient;
	chartLyrics: ChartLyricsClient;
	acousticbrainz: AcousticbrainzClient;
	coverArtArchive: CoverArtArchiveClient;
	wikipedia: WikipediaClient;
	private isSaving: { [filename: string]: boolean } = {};

	constructor(tools: ThirdpartyToolsConfig) {
		this.musicbrainz = new MusicbrainzClient({userAgent: tools.musicbrainz.userAgent, retryOn: true});
		this.acousticbrainz = new AcousticbrainzClient({userAgent: tools.acousticbrainz.userAgent, retryOn: true});
		this.lastFM = new LastFMClient({key: tools.lastfm.apiKey, userAgent: tools.lastfm.userAgent});
		this.acoustid = new AcoustidClient({key: tools.acoustid.apiKey, userAgent: tools.acoustid.userAgent});
		this.chartLyrics = new ChartLyricsClient(tools.chartlyrics.userAgent);
		this.wikipedia = new WikipediaClient(tools.wikipedia.userAgent);
		this.coverArtArchive = new CoverArtArchiveClient({userAgent: tools.coverartarchive.userAgent, retryOn: true});
	}

	async read(filename: string): Promise<AudioScanResult> {
		const suffix = fileSuffix(filename);
		if (suffix === AudioFormatType.mp3) {
			const mp3 = new MP3();
			try {
				const result = await mp3.read({filename, mpegQuick: true, mpeg: true, id3v2: true});
				if (!result) {
					return {tag: {format: TrackTagFormatType.none}, media: {}};
				} else {
					if (result.id3v2) {
						return {tag: FORMAT.packID3v2JamServeTag(result.id3v2), media: FORMAT.packJamServeMedia(result.mpeg)};
					}
					const id3v1 = new ID3v1();
					const v1 = await id3v1.read(filename);
					if (!v1) {
						return {tag: {format: TrackTagFormatType.none}, media: FORMAT.packJamServeMedia(result.mpeg)};
					}
					return {tag: FORMAT.packID3v1JamServeTag(v1), media: FORMAT.packJamServeMedia(result.mpeg)};
				}
			} catch (e) {
				console.error(e);
				return {tag: {format: TrackTagFormatType.none}, media: {}};
			}
		} else {
			const p = await probe(filename, []);
			if (!p) {
				return {tag: {format: TrackTagFormatType.none}, media: {}};
			} else {
				return {tag: FORMAT.packProbeJamServeTag(p), media: FORMAT.packProbeJamServeMedia(p, <AudioFormatType>suffix)};
			}
		}
	}

	async saveRawTag(filename: string, tag: Jam.RawTag): Promise<void> {
		if (this.isSaving[filename]) {
			console.error('Another save is in progress', filename);
			return Promise.reject(Error('Another save is in progress'));
		}
		this.isSaving[filename] = true;
		try {
			// const exists = await fse.pathExists(filename + '.bak.org');
			// if (!exists) {
			// 	await fse.copy(filename, filename + '.bak.org');
			// }
			const frames: Array<IID3V2.Frame> = [];
			Object.keys(tag.frames).map(id => {
				const f = tag.frames[id] || [];
				f.forEach(value => {
					if (value && value.hasOwnProperty('bin')) {
						const binValue = <any>value;
						binValue.bin = Buffer.from(binValue.bin, 'base64');
					}
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

	async readID3v2(filename: string): Promise<Jam.RawTag> {
		const id3v2 = new ID3v2();
		const id3v2tag = await id3v2.read(filename);
		if (!id3v2tag || !id3v2tag.head) {
			return Promise.reject(Error('No ID3v2 Tag found'));
		}
		const tag: Jam.RawTag = {
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

	async coverartarchiveLookup(type: string, id: string): Promise<CoverArtArchive.Response> {
		if (type === CoverArtArchiveLookupType.release) {
			return this.coverArtArchive.releaseImages(id);
		} else if (type === CoverArtArchiveLookupType.releaseGroup) {
			return this.coverArtArchive.releaseGroupImages(id);
		} else {
			return Promise.reject(Error('Invalid CoverArtArchive Lookup Type'));
		}
	}

	async lastFMLookup(type: string, id: string): Promise<LastFM.Result> {
		// TODO: get more than 50
		return this.lastFM.lookup(type, id);
	}

	async getLyrics(artist: string, song: string): Promise<ChartLyricsResult | undefined> {
		return this.chartLyrics.search(artist, song);
	}

	async wikipediaSummary(title: string, lang: string | undefined): Promise<{ title: string, url: string, summary: string } | undefined> {
		return await this.wikipedia.summary(title, lang);
	}

	async wikidataID(id: string): Promise<WikiData.Entity | undefined> {
		return await this.wikipedia.wikidata(id);
	}
}
