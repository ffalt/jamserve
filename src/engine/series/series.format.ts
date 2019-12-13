import {Jam} from '../../model/jam-rest-data';
import {JamParameters} from '../../model/jam-rest-params';
import {Series} from './series.model';

export function formatSeries(series: Series, includes: JamParameters.IncludesSeries): Jam.Series {
	return {
		id: series.id,
		name: series.name,
		artist: series.artist,
		artistID: series.artistID,
		albumCount: series.albumIDs.length,
		trackCount: series.trackIDs.length,
		albumTypes: series.albumTypes,
		albumIDs: includes.seriesAlbumIDs ? series.albumIDs : undefined,
		trackIDs: includes.seriesTrackIDs ? series.trackIDs : undefined,
		created: series.created
	};
}
