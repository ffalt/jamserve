import {Jam} from '../../model/jam-rest-data';
import {JamParameters} from '../../model/jam-rest-params';
import {Track, TrackTag} from './track.model';

export function formatTrackTag(tag: TrackTag): Jam.TrackTag {
	let mbz: Jam.TrackMBTag | undefined = {
		recordingID: tag.mbRecordingID,
		releaseTrackID: tag.mbReleaseTrackID,
		releaseGroupID: tag.mbReleaseGroupID,
		trackID: tag.mbTrackID,
		artistID: tag.mbArtistID,
		releaseID: tag.mbAlbumID
	};
	if (!Object.keys(mbz).find(key => !!(mbz as any)[key])) {
		mbz = undefined;
	}
	return {
		trackNr: tag.track,
		disc: tag.discTotal !== undefined && tag.discTotal > 1 ? tag.disc : undefined,
		year: tag.year,
		title: tag.title,
		artist: tag.artist,
		album: tag.album,
		genre: tag.genre,
		musicbrainz: mbz
	};
}

export function formatTrack(track: Track, includes: JamParameters.IncludesTrack): Jam.Track {
	includes = includes || {};
	return {
		id: track.id,
		parentID: track.parentID,
		artistID: track.artistID,
		albumArtistID: track.albumArtistID,
		albumID: track.albumID,
		name: track.name,
		created: track.stat.created,
		duration: track.media.duration || -1,
		media: includes.trackMedia ? {
			bitRate: track.media.bitRate || -1,
			format: track.media.format || '',
			channels: track.media.channels || -1,
			sampleRate: track.media.sampleRate || -1,
			size: track.stat.size || -1
		} : undefined,
		tag: includes.trackTag ? formatTrackTag(track.tag) : undefined
	};
}
