import {ID3v1_GENRES, ID3v2, IID3V1, IID3V2, IMP3} from 'jamp3';
import {TrackMedia, TrackTag} from '../../engine/track/track.model';
import {AudioFormatType, TrackTagFormatType} from '../../model/jam-types';
import {cleanGenre} from '../../utils/genres';
import {ID3TrackTagRawFormatTypes} from './audio.module';
import {FlacComment, FlacMedia, FlacPicture} from './formats/flac';
import {ProbeResult} from './tools/ffprobe';

export class FORMAT {
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
			version: `${data.version} ${data.layer}`
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
		const simple: { [name: string]: string | undefined } = {};
		Object.keys(data.format.tags).forEach(key => {
			simple[key.toUpperCase().replace(/ /g, '_')] = FORMAT.cleanText(data.format.tags[key]);
		});
		return {
			format: TrackTagFormatType.ffmpeg,
			artist: simple.ARTIST,
			title: simple.TITLE,
			album: simple.ALBUM,
			year: FORMAT.parseNum(simple.DATE),
			track: FORMAT.parseNum(simple.TRACK),
			disc: FORMAT.parseNum(simple.DISC),
			grouping: simple.WORK,
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
			artist: FORMAT.cleanText(simple.artist),
			title: FORMAT.cleanText(simple.title),
			album: FORMAT.cleanText(simple.album),
			year: FORMAT.parseNum(simple.year),
			track: simple.track,
			genre: (simple.genreIndex !== undefined && !!ID3v1_GENRES[simple.genreIndex]) ? ID3v1_GENRES[simple.genreIndex] : undefined
		};
	}

	static packID3v2JamServeTag(data?: IID3V2.Tag): TrackTag | undefined {
		if (!data) {
			return undefined;
		}
		// const chapters: Array<TrackTagChapter> = data.frames.filter(frame => frame.id === 'CHAP').map(c => {
		// 	const chapter = <Chapter>c;
		// 	const chapterTag = simplifyTag({id: data.id, start: 0, end: 0, head: data.head, frames: c.subframes || []});
		// 	return {
		// 		id: chapter.id,
		// 		start: chapter.value.start,
		// 		end: chapter.value.end,
		// 		title: chapterTag.TITLE
		// 	};
		// });
		const simple = ID3v2.simplify(data, ['CHAP', 'APIC']);
		const pics = data.frames.filter(f => f.id === 'APIC');
		const format = ID3TrackTagRawFormatTypes[data.head ? data.head.rev : -1] || TrackTagFormatType.none;
		return {
			format,
			album: FORMAT.cleanText(simple.ALBUM),
			albumSort: FORMAT.cleanText(simple.ALBUMSORT),
			albumArtist: FORMAT.cleanText(simple.ALBUMARTIST),
			albumArtistSort: FORMAT.cleanText(simple.ALBUMARTISTSORT),
			artist: FORMAT.cleanText(simple.ARTIST),
			artistSort: FORMAT.cleanText(simple.ARTISTSORT),
			title: FORMAT.cleanText(simple.TITLE),
			titleSort: FORMAT.cleanText(simple.TITLESORT),
			genre: simple.GENRE ? cleanGenre(simple.GENRE) : undefined,
			disc: FORMAT.parseNum(simple.DISCNUMBER),
			discTotal: FORMAT.parseNum(simple.DISCTOTAL),
			track: FORMAT.parseNum(simple.TRACKNUMBER),
			trackTotal: FORMAT.parseNum(simple.TRACKTOTAL),
			grouping: simple.WORK,
			year: FORMAT.parseYear(simple.ORIGINALDATE) || FORMAT.parseYear(simple.DATE) || FORMAT.parseYear(simple.RELEASETIME),
			mbTrackID: simple.MUSICBRAINZ_TRACKID,
			mbAlbumType: simple.RELEASETYPE,
			mbAlbumArtistID: simple.MUSICBRAINZ_ALBUMARTISTID,
			mbArtistID: simple.MUSICBRAINZ_ARTISTID,
			mbAlbumID: simple.MUSICBRAINZ_ALBUMID,
			mbReleaseTrackID: simple.MUSICBRAINZ_RELEASETRACKID,
			mbReleaseGroupID: simple.MUSICBRAINZ_RELEASEGROUPID,
			mbRecordingID: simple.MUSICBRAINZ_RELEASETRACKID,
			mbAlbumStatus: simple.RELEASESTATUS,
			mbReleaseCountry: simple.RELEASECOUNTRY,
			nrTagImages: pics.length
			// chapters: chapters.length > 0 ? chapters : undefined
		};
	}

	private static cleanText(s: string | undefined): string | undefined {
		return s !== undefined ? s.replace(/  /g, ' ').trim() : undefined;
	}

	static packFlacVorbisCommentJamServeTag(comment?: FlacComment, pictures?: Array<FlacPicture>): TrackTag | undefined {
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
			disc: FORMAT.parseNum(simple.DISCNUMBER),
			discTotal: FORMAT.parseNum(simple.DISCTOTAL) || FORMAT.parseNum(simple.TOTALDISCS),
			title: simple.TITLE,
			titleSort: simple.TITLESORT,
			track: FORMAT.parseNum(simple.TRACKNUMBER) || FORMAT.parseNum(simple.TRACK),
			trackTotal: FORMAT.parseNum(simple.TRACKTOTAL) || FORMAT.parseNum(simple.TOTALTRACKS),
			year: FORMAT.parseYear(simple.ORIGINALYEAR) || FORMAT.parseYear(simple.ORIGINALDATE) || FORMAT.parseYear(simple.DATE),
			grouping: simple.WORK,
			mbTrackID: simple.MUSICBRAINZ_TRACKID,
			mbAlbumType: simple.RELEASETYPE,
			mbAlbumArtistID: simple.MUSICBRAINZ_ALBUMARTISTID,
			mbArtistID: simple.MUSICBRAINZ_ARTISTID,
			mbAlbumID: simple.MUSICBRAINZ_ALBUMID,
			mbReleaseTrackID: simple.MUSICBRAINZ_RELEASETRACKID,
			mbReleaseGroupID: simple.MUSICBRAINZ_RELEASEGROUPID,
			mbRecordingID: simple.MUSICBRAINZ_RELEASETRACKID,
			mbAlbumStatus: simple.RELEASESTATUS,
			mbReleaseCountry: simple.RELEASECOUNTRY,
			nrTagImages: pictures ? pictures.length : undefined
		};

	}

}
