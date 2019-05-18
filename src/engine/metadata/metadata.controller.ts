import {JamRequest} from '../../api/jam/api';
import {AcousticBrainz} from '../../model/acousticbrainz-rest-data';
import {Acoustid} from '../../model/acoustid-rest-data';
import {CoverArtArchive} from '../../model/coverartarchive-rest-data';
import {Jam} from '../../model/jam-rest-data';
import {JamParameters} from '../../model/jam-rest-params';
import {LastFM} from '../../model/lastfm-rest-data';
import {MusicBrainz} from '../../model/musicbrainz-rest-data';
import {TrackController} from '../track/track.controller';
import {MetaDataService} from './metadata.service';

export class MetadataController {

	constructor(private metadataService: MetaDataService, private trackController: TrackController) {
	}

	async musicbrainzSearch(req: JamRequest<JamParameters.MusicBrainzSearch>): Promise<MusicBrainz.Response> {
		const query = {...req.query};
		delete query.type;
		return this.metadataService.musicbrainzSearch(req.query.type, query);
	}

	async acoustidLookup(req: JamRequest<JamParameters.AcoustidLookup>): Promise<Array<Acoustid.Result>> {
		const track = await this.trackController.byID(req.query.id);
		return this.metadataService.acoustidLookupTrack(track, req.query.inc);
	}

	async lastfmLookup(req: JamRequest<JamParameters.LastFMLookup>): Promise<LastFM.Result> {
		return this.metadataService.lastFMLookup(req.query.type, req.query.id);
	}

	async acousticbrainzLookup(req: JamRequest<JamParameters.AcousticBrainzLookup>): Promise<AcousticBrainz.Response> {
		return this.metadataService.acousticbrainzLookup(req.query.id, req.query.nr);
	}

	async coverartarchiveLookup(req: JamRequest<JamParameters.CoverArtArchiveLookup>): Promise<CoverArtArchive.Response> {
		return this.metadataService.coverartarchiveLookup(req.query.type, req.query.id);
	}

	async musicbrainzLookup(req: JamRequest<JamParameters.MusicBrainzLookup>): Promise<MusicBrainz.Response> {
		return this.metadataService.musicbrainzLookup(req.query.type, req.query.id, req.query.inc);
	}

	async wikipediaSummary(req: JamRequest<JamParameters.WikipediaSummary>): Promise<Jam.WikipediaSummaryResponse> {
		return this.metadataService.wikipediaSummary(req.query.title, req.query.lang);
	}

	async wikidataSummary(req: JamRequest<JamParameters.WikidataSummary>): Promise<Jam.WikipediaSummaryResponse> {
		return this.metadataService.wikidataSummary(req.query.id, req.query.lang);
	}

	async wikidataLookup(req: JamRequest<JamParameters.WikidataLookup>): Promise<Jam.WikidataLookupResponse> {
		return this.metadataService.wikidataLookup(req.query.id);
	}

	async chartlyricsSearch(req: JamRequest<JamParameters.ChartlyricsSearch>): Promise<Jam.ChartLyricsResponse> {
		return this.metadataService.chartlyricsSearch(req.query.artist, req.query.song);
	}
}
