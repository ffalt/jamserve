import {JamParameters} from '../../model/jam-rest-params';
import {MusicBrainz} from '../../model/musicbrainz-rest-data';
import {Acoustid} from '../../model/acoustid-rest-data';
import {LastFM} from '../../model/lastfm-rest-data';
import {JamRequest} from '../../api/jam/api';
import {TrackController} from '../track/track.controller';
import {AcousticBrainz} from '../../model/acousticbrainz-rest-data';
import {CoverArtArchive} from '../../model/coverartarchive-rest-data';
import {MetaDataService} from './metadata.service';

export class MetadataController {

	constructor(private metadataService: MetaDataService, private trackController: TrackController) {
	}

	async musicbrainzSearch(req: JamRequest<JamParameters.MusicBrainzSearch>): Promise<MusicBrainz.Response> {
		const query = Object.assign({}, req.query);
		delete query.type;
		return await this.metadataService.musicbrainzSearch(req.query.type, query);
	}

	async acoustidLookup(req: JamRequest<JamParameters.AcoustidLookup>): Promise<Array<Acoustid.Result>> {
		const track = await this.trackController.byID(req.query.id);
		return await this.metadataService.acoustidLookupTrack(track, req.query.inc);
	}

	async lastfmLookup(req: JamRequest<JamParameters.LastFMLookup>): Promise<LastFM.Result> {
		return await this.metadataService.lastFMLookup(req.query.type, req.query.id);
	}

	async acousticbrainzLookup(req: JamRequest<JamParameters.AcousticBrainzLookup>): Promise<AcousticBrainz.Response> {
		return await this.metadataService.acousticbrainzLookup(req.query.id, req.query.nr);
	}

	async coverartarchiveLookup(req: JamRequest<JamParameters.CoverArtArchiveLookup>): Promise<CoverArtArchive.Response> {
		return await this.metadataService.coverartarchiveLookup(req.query.type, req.query.id);
	}

	async musicbrainzLookup(req: JamRequest<JamParameters.MusicBrainzLookup>): Promise<MusicBrainz.Response> {
		return await this.metadataService.musicbrainzLookup(req.query.type, req.query.id, req.query.inc);
	}
}
