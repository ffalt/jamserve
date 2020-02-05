import {Jam} from '../../model/jam-rest-data';
import {JamParameters} from '../../model/jam-rest-params';
import {Track, TrackTag} from './track.model';

export function formatTrackTag(tag: TrackTag): Jam.TrackTag {
	return {
		trackNr: tag.track,
		disc: tag.discTotal !== undefined && tag.discTotal > 1 ? tag.disc : undefined,
		year: tag.year,
		title: tag.title,
		artist: tag.artist,
		album: tag.album,
		genre: tag.genre,
		mbRecordingID: tag.mbRecordingID,
		mbReleaseTrackID: tag.mbReleaseTrackID,
		mbReleaseGroupID: tag.mbReleaseGroupID,
		mbTrackID: tag.mbTrackID,
		mbArtistID: tag.mbArtistID,
		mbReleaseID: tag.mbReleaseID
	};
}

export function formatTrack(track: Track, includes: JamParameters.IncludesTrack): Jam.Track {
	includes = includes || {};
	return {
		id: track.id,
		parentID: track.parentID,
		artistID: track.artistID,
		seriesID: track.seriesID,
		albumArtistID: track.albumArtistID,
		albumID: track.albumID,
		name: track.name,
		created: track.stat.created,
		duration: track.media.duration || -1,
		media: includes.trackMedia ? {
			bitRate: track.media.bitRate,
			format: track.media.format || '',
			channels: track.media.channels,
			sampleRate: track.media.sampleRate,
			size: track.stat.size
		} : undefined,
		tag: includes.trackTag ? formatTrackTag(track.tag) : undefined
	};
}
