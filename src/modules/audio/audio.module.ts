import fse from 'fs-extra';
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
import {AudioFormatType, CoverArtArchiveLookupType, TrackTagFormatType} from '../../model/jam-types';
import {WikiData, WikipediaClient} from './clients/wikipedia-client';
import {Flac, FlacComment, FlacMedia} from './formats/flac/flac';
import {MetaWriteableDataBlock} from './formats/flac/lib/block';
import {ImageModule} from '../image/image.module';
import {flacToRawTag, id3v2ToFlacMetaData, id3v2ToRawTag, rawTagToID3v2} from './metadata';

export interface AudioScanResult {
	media?: TrackMedia;
	tag?: TrackTag;
}

export const ID3TrackTagRawFormatTypes = [TrackTagFormatType.id3v20, TrackTagFormatType.id3v21, TrackTagFormatType.id3v22, TrackTagFormatType.id3v23, TrackTagFormatType.id3v24];

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

	static packFlacMediaInfoJamServeMedia(media?: FlacMedia): TrackMedia {
		if (!media) {
			return {};
		}
		return {
			format: AudioFormatType.flac,
			duration: media.duration,
			sampleRate: media.sampleRate,
			encoded: 'VBR',
			channels: media.channels
		};
	}

	static parseNum(s: string | undefined): number | undefined {
		if (s !== undefined) {
			const n = Number(s.trim());
			if (isNaN(n)) {
				return;
			}
			return n;
		}
	}

	static parseYear(s: string | undefined): number | undefined {
		if (s !== undefined) {
			s = s.slice(0, 4).trim();
			if (s.length === 4) {
				const n = Number(s);
				if (isNaN(n)) {
					return;
				}
				return n;
			}
		}
	}

	static packProbeJamServeTag(data: ProbeResult): TrackTag {
		if (!data || !data.format || !data.format.tags) {
			return {format: TrackTagFormatType.none};
		}
		const simple: { [name: string]: string } = {};
		Object.keys(data.format.tags).forEach(key => {
			simple[key.toUpperCase().replace(/ /g, '_')] = data.format.tags[key];
		});
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
		const format = ID3TrackTagRawFormatTypes[data.head ? data.head.rev : -1] || TrackTagFormatType.none;
		return {
			format,
			album: simple.ALBUM,
			albumSort: simple.ALBUMSORT,
			albumArtist: simple.ALBUMARTIST,
			albumArtistSort: simple.ALBUMARTISTSORT,
			artist: simple.ARTIST,
			artistSort: simple.ARTISTSORT,
			title: simple.TITLE,
			titleSort: simple.TITLESORT,
			genre: simple.GENRE ? cleanGenre(simple.GENRE) : undefined,
			disc: this.parseNum(simple.DISCNUMBER),
			discTotal: this.parseNum(simple.DISCTOTAL),
			track: this.parseNum(simple.TRACKNUMBER),
			trackTotal: this.parseNum(simple.TRACKTOTAL),
			year: this.parseYear(simple.ORIGINALDATE) || this.parseYear(simple.DATE) || this.parseYear(simple.RELEASETIME),
			mbTrackID: simple.MUSICBRAINZ_TRACKID,
			mbAlbumType: simple.RELEASETYPE,
			mbAlbumArtistID: simple.MUSICBRAINZ_ALBUMARTISTID,
			mbArtistID: simple.MUSICBRAINZ_ARTISTID,
			mbAlbumID: simple.MUSICBRAINZ_ALBUMID,
			mbReleaseTrackID: simple.MUSICBRAINZ_RELEASETRACKID,
			mbReleaseGroupID: simple.MUSICBRAINZ_RELEASEGROUPID,
			mbRecordingID: simple.MUSICBRAINZ_RELEASETRACKID,
			mbAlbumStatus: simple.RELEASESTATUS,
			mbReleaseCountry: simple.RELEASECOUNTRY
		};
	}

	static packFlacVorbisCommentJamServeTag(comment?: FlacComment): TrackTag | undefined {
		if (!comment || !comment.tag) {
			return undefined;
		}
		const simple: { [key: string]: string | undefined } = comment.tag;
		return {
			format: TrackTagFormatType.vorbis,
			album: simple.ALBUM,
			albumSort: simple.ALBUMSORT,
			albumArtist: simple.ALBUMARTIST,
			albumArtistSort: simple.ALBUMARTISTSORT,
			artist: simple.ARTIST,
			artistSort: simple.ARTISTSORT,
			genre: simple.GENRE ? cleanGenre(simple.GENRE) : undefined,
			disc: this.parseNum(simple.DISCNUMBER),
			discTotal: this.parseNum(simple.DISCTOTAL) || this.parseNum(simple.TOTALDISCS),
			title: simple.TITLE,
			titleSort: simple.TITLESORT,
			track: this.parseNum(simple.TRACKNUMBER) || this.parseNum(simple.TRACK),
			trackTotal: this.parseNum(simple.TRACKTOTAL) || this.parseNum(simple.TOTALTRACKS),
			year: this.parseYear(simple.ORIGINALYEAR) || this.parseYear(simple.DATE),
			mbTrackID: simple.MUSICBRAINZ_TRACKID,
			mbAlbumType: simple.RELEASETYPE,
			mbAlbumArtistID: simple.MUSICBRAINZ_ALBUMARTISTID,
			mbArtistID: simple.MUSICBRAINZ_ARTISTID,
			mbAlbumID: simple.MUSICBRAINZ_ALBUMID,
			mbReleaseTrackID: simple.MUSICBRAINZ_RELEASETRACKID,
			mbReleaseGroupID: simple.MUSICBRAINZ_RELEASEGROUPID,
			mbRecordingID: simple.MUSICBRAINZ_RELEASETRACKID,
			mbAlbumStatus: simple.RELEASESTATUS,
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

	constructor(tools: ThirdpartyToolsConfig, public imageModule: ImageModule) {
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
				const result = await mp3.read(filename, {mpegQuick: true, mpeg: true, id3v2: true});
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
		} else if (suffix === AudioFormatType.flac) {
			const flac = new Flac();
			try {
				const result = await flac.read(filename);
				return {tag: FORMAT.packFlacVorbisCommentJamServeTag(result.comment), media: FORMAT.packFlacMediaInfoJamServeMedia(result.media)};
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

	async writeRawTag(filename: string, tag: Jam.RawTag): Promise<void> {
		if (this.isSaving[filename]) {
			console.error('Another save is in progress', filename);
			return Promise.reject(Error('Another save is in progress'));
		}
		this.isSaving[filename] = true;
		const suffix = fileSuffix(filename);
		try {
			if (suffix === AudioFormatType.mp3) {
				await this.writeMP3Tag(filename, tag);
			} else if (suffix === AudioFormatType.flac) {
				await this.writeFlacTag(filename, tag);
			} else {
				delete this.isSaving[filename];
				return Promise.reject(new Error('Writing to format ' + suffix + ' is currently not supported'));
			}
			delete this.isSaving[filename];
		} catch (e) {
			delete this.isSaving[filename];
			return Promise.reject(e);
		}
	}

	async readRawTag(filename: string): Promise<Jam.RawTag | undefined> {
		const suffix = fileSuffix(filename);
		if (suffix === AudioFormatType.mp3) {
			return this.readMP3RawTag(filename);
		} else if (suffix === AudioFormatType.flac) {
			return this.readFlacRawTag(filename);
		}
	}

	private async readFlacRawTag(filename: string): Promise<Jam.RawTag | undefined> {
		const flac = new Flac();
		const result = await flac.read(filename);
		if (!result || !result.comment) {
			return Promise.reject(Error('No Flac Vorbis Comment found'));
		}
		return flacToRawTag(result);
	}

	private async readMP3RawTag(filename: string): Promise<Jam.RawTag | undefined> {
		const id3v2 = new ID3v2();
		const result = await id3v2.read(filename);
		if (!result || !result.head) {
			return Promise.reject(Error('No ID3v2 Tag found'));
		}
		return id3v2ToRawTag(result);
	}

	private async writeMP3Tag(filename: string, tag: Jam.RawTag) {
		const id3 = rawTagToID3v2(tag);
		const id3v2 = new ID3v2();
		await id3v2.write(filename, id3, id3.head ? id3.head.ver : 4, id3.head ? id3.head.rev : 0);
	}

	private async writeFlacTag(filename: string, tag: Jam.RawTag) {
		const id3 = rawTagToID3v2(tag);
		const flacBlocks: Array<MetaWriteableDataBlock> = await id3v2ToFlacMetaData(id3, this.imageModule);
		const flac = new Flac();
		// TODO: add tests for flac writing, make backup copy as long it is not well tested
		const exits = await fse.pathExists(filename + '.bak');
		if (!exits) {
			await fse.copy(filename, filename + '.bak');
		}
		await flac.write(filename, flacBlocks);
	}

	async readMP3Image(filename: string, type: number): Promise<{ buffer?: Buffer, mimeType?: string }> {
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
