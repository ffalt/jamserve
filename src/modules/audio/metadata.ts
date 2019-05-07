import {ID3V24TagBuilder, IID3V2, simplifyTag} from 'jamp3';
import moment from 'moment';
import {ID3v2Frames} from '../../model/id3v2-frames';
import {Jam} from '../../model/jam-rest-data';
import {TrackTag} from '../../objects/track/track.model';
import {ImageModule} from '../image/image.module';
import {FlacInfo} from './formats/flac';
import {MetaDataBlockPicture} from './formats/flac/lib/block.picture';
import {BlockVorbiscomment} from './formats/flac/lib/block.vorbiscomment';
import {MetaWriteableDataBlock} from './formats/flac/lib/block.writeable';

export async function flacToRawTag(flacInfo: FlacInfo): Promise<Jam.RawTag | undefined> {
	if (!flacInfo || !flacInfo.comment || !flacInfo.comment.tag) {
		return;
	}
	const simple = flacInfo.comment.tag;
	const builder = new ID3V24TagBuilder();
	builder
		.album(simple.ALBUM)
		.albumSort(simple.ALBUMSORT)
		.originalAlbum(simple.ORIGINALALBUM)
		.originalArtist(simple.ORIGINALARTIST)
		.originalDate(simple.ORIGINALDATE)
		.originalYear(simple.ORIGINALYEAR)
		.title(simple.TITLE)
		.titleSort(simple.TITLESORT)
		.work(simple.WORK)
		.artist(simple.ARTIST)
		.artistSort(simple.ARTISTSORT)
		.albumArtist(simple.ALBUMARTIST)
		.albumArtistSort(simple.ALBUMARTISTSORT)
		.artists(simple.ARTISTS)
		.isCompilation(simple.COMPILATION)
		.grouping(simple.GROUPING)
		.date(simple.DATE)
		.composer(simple.COMPOSER)
		.composerSort(simple.COMPOSER)
		.remixer(simple.REMIXER)
		.label(simple.LABEL)
		.subtitle(simple.SUBTITLE)
		.discSubtitle(simple.DISCSUBTITLE)
		.lyricist(simple.LYRICIST)
		.genre(simple.GENRE)
		.bmp(simple.BPM)
		.mood(simple.MOOD)
		.lyrics(simple.LYRICS)
		.media(simple.MEDIA)
		.language(simple.LANGUAGE)
		.encoder(simple.ENCODEDBY || simple['ENCODED-BY'])
		.encoderSettings(simple.ENCODERSETTINGS)
		.key(simple.KEY)
		.copyright(simple.COPYRIGHT)
		.isrc(simple.ISRC)
		.barcode(simple.BARCODE)
		.asin(simple.ASIN)
		.catalogNumber(simple.CATALOGNUMBER)
		.script(simple.SCRIPT)
		.license(simple.LICENSE)
		.website(simple.WEBSITE)
		.movement(simple.MOVEMENTNAME)
		.movementNr(simple.MOVEMENT, simple.MOVEMENTTOTAL)
		.writer(simple.WRITER)
		.track(simple.TRACKNUMBER, simple.TRACKTOTAL || simple.TOTALTRACKS)
		.disc(simple.DISCNUMBER, simple.DISCTOTAL || simple.TOTALDISCS)
		.musicianCredit('instrument', simple.PERFORMER)
		.involved('arranger', simple.ARRANGER)
		.involved('engineer', simple.ENGINEER)
		.involved('producer', simple.PRODUCER)
		.involved('DJ-mix', simple.DJMIXER)
		.involved('mix', simple.MIXER)
		.mbAlbumStatus(simple.RELEASESTATUS)
		.mbAlbumType(simple.RELEASETYPE)
		.mbAlbumReleaseCountry(simple.RELEASECOUNTRY)
		.mbTrackID(simple.MUSICBRAINZ_TRACKID)
		.mbReleaseTrackID(simple.MUSICBRAINZ_RELEASETRACKID)
		.mbAlbumID(simple.MUSICBRAINZ_ALBUMID)
		.mbOriginalAlbumID(simple.MUSICBRAINZ_ORIGINALALBUMID)
		.mbArtistID(simple.MUSICBRAINZ_ARTISTID)
		.mbOriginalArtistID(simple.MUSICBRAINZ_ORIGINALARTISTID)
		.mbAlbumArtistID(simple.MUSICBRAINZ_ALBUMARTISTID)
		.mbReleaseGroupID(simple.MUSICBRAINZ_RELEASEGROUPID)
		.mbWorkID(simple.MUSICBRAINZ_WORKID)
		.mbTRMID(simple.MUSICBRAINZ_TRMID)
		.mbDiscID(simple.MUSICBRAINZ_DISCID)
		.acoustidID(simple.ACOUSTID_ID)
		.acoustidFingerprint(simple.ACOUSTID_FINGERPRINT)
		.musicIPPUID(simple.MUSICIP_PUID)
		.custom('CATALOGUE', simple.CATALOGUE)
		.custom('VERSION', simple.VERSION)
		.custom('ACCURATERIPRESULT', simple.ACCURATERIPRESULT)
		.custom('UPC', simple.UPC)
		.custom('EAN', simple.EAN)
		.custom('UPN', simple.UPN)
		.custom('STYLE', simple.STYLE)
		.custom('LOCATION', simple.LOCATION)
		.custom('PERIOD', simple.PERIOD)
		.custom('SOLOISTS', simple.SOLOISTS)
		.custom('PARTNUMBER', simple.PARTNUMBER)
		.custom('LABELNO', simple.LABELNO)
		.custom('OPUS', simple.OPUS)
		.custom('PART', simple.PART)
		.custom('SOURCE', simple.SOURCE)
		.custom('SOURCEMEDIA', simple.SOURCEMEDIA)
		.custom('SHOWMOVEMENT', simple.SHOWMOVEMENT)
		.custom('REPLAYGAIN_ALBUM_GAIN', simple.REPLAYGAIN_ALBUM_GAIN)
		.custom('REPLAYGAIN_ALBUM_PEAK', simple.REPLAYGAIN_ALBUM_PEAK)
		.custom('REPLAYGAIN_TRACK_GAIN', simple.REPLAYGAIN_TRACK_GAIN)
		.custom('REPLAYGAIN_TRACK_PEAK', simple.REPLAYGAIN_TRACK_PEAK)
		.comment('comment', simple.COMMENT)
		.comment('description', simple.DESCRIPTION)
	;

	// builder.popm('POPM', simple['RATING:user@email']);
	// builder.idtext('TXXX', 'MusicMagic Fingerprint', simple.FINGERPRINT=MusicMagic Fingerprint);

	const pad = '000';
	let nr = 1;
	let id = 'CHAPTER' + pad.substring(0, pad.length - nr.toString().length) + nr.toString();
	while (simple[id]) {
		const chapterTime = moment(simple[id]).valueOf() || 0;
		const chapterID = simple[id + 'ID'] || id;
		const chapterName = simple[id + 'NAME'];
		const chapterURL = simple[id + 'URL'];
		const subframeBuilder = new ID3V24TagBuilder();
		subframeBuilder.title(chapterName).website(chapterURL);
		builder.chapter(chapterID, chapterTime, chapterTime, 0, 0, subframeBuilder.buildFrames());
		nr++;
		id = 'CHAPTER' + pad.substring(0, pad.length - nr.toString().length) + nr.toString();
	}

	if (flacInfo.pictures) {
		for (const pic of flacInfo.pictures) {
			builder.addPicture(pic.pictureType, pic.description, pic.mimeType, pic.pictureData);
		}
	}
	const tag = {version: 4, frames: builder.rawBuilder.build()};
	prepareResponseTag(tag);
	return tag;
}

export async function id3v2ToRawTag(id3v2tag: IID3V2.Tag): Promise<Jam.RawTag | undefined> {
	const tag: Jam.RawTag = {
		version: id3v2tag.head ? id3v2tag.head.ver : 4,
		frames: {}
	};
	id3v2tag.frames.forEach(frame => {
		const f = tag.frames[frame.id] || [];
		f.push({id: frame.id, value: frame.value});
		tag.frames[frame.id] = f;
	});
	prepareResponseTag(tag);
	return tag;
}

export async function id3v2ToFlacMetaData(tag: IID3V2.Tag, imageModule: ImageModule): Promise<Array<MetaWriteableDataBlock>> {
	const DropFramesList = [
		'TSIZ',
		'APIC'
	];
	const simple = simplifyTag(tag, DropFramesList) as any;
	const comments: Array<string> = [];
	Object.keys(simple).forEach(key => {
		comments.push(key + '=' + simple[key].toString());
	});
	const result: Array<MetaWriteableDataBlock> = [BlockVorbiscomment.createVorbisCommentBlock('jamserve', comments)];
	const pics = tag.frames.filter(frame => frame.id === 'APIC') as Array<{ id: string; value: IID3V2.FrameValue.Pic }>;
	for (const pic of pics) {
		if (pic.value.bin && pic.value.mimeType) {
			const imageInfo = await imageModule.getImageInfo(pic.value.bin, pic.value.mimeType);
			const picBlock = MetaDataBlockPicture.createPictureBlock(pic.value.pictureType, pic.value.mimeType, pic.value.description,
				imageInfo.width, imageInfo.height, imageInfo.colorDepth, imageInfo.colors, pic.value.bin);
			result.push(picBlock);
		}
	}
	return result;
}

export function trackTagToRawTag(tag: TrackTag): Jam.RawTag {
	const builder = new ID3V24TagBuilder();
	builder.artist(tag.artist)
		.album(tag.album)
		.title(tag.title)
		.genre(tag.genre)
		.track(tag.track, tag.trackTotal)
		.disc(tag.disc, tag.discTotal)
		.year(tag.year);
	return {version: 4, frames: builder.rawBuilder.build()};
}

function prepareFrame(frame: ID3v2Frames.Frame): void {
	if (frame && frame.value && frame.value.hasOwnProperty('bin')) {
		const binValue = frame.value as any;
		binValue.bin = binValue.bin.toString('base64');
	}
	if (frame && frame.subframes) {
		frame.subframes.forEach(prepareFrame);
	}
}

export function prepareResponseTag(tag: Jam.RawTag): void {
	Object.keys(tag.frames).forEach(key => {
		const frames = tag.frames[key];
		if (frames) {
			frames.forEach(prepareFrame);
		}
	});
}

function rawFrameToID3v2(frame: ID3v2Frames.Frame): void {
	if (frame && frame.value && frame.value.hasOwnProperty('bin')) {
		const bin = (frame.value as any).bin;
		if (typeof bin === 'string') {
			(frame.value as any).bin = Buffer.from(bin, 'base64');
		}
	}
	if (frame && frame.subframes) {
		frame.subframes.forEach(rawFrameToID3v2);
	}
}

export function rawTagToID3v2(tag: Jam.RawTag): IID3V2.Tag {
	const frames: Array<IID3V2.Frame> = [];
	Object.keys(tag.frames).map(id => {
		const f = tag.frames[id] || [];
		f.forEach(frame => {
			rawFrameToID3v2(frame);
			frames.push(frame);
		});
		return;
	});
	return {
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
}
