import {JamParameters} from '../../model/jam-rest-params-0.1.0';
import {MusicBrainz} from '../../model/musicbrainz-rest-data-2.0';
import {Acoustid} from '../../model/acoustid-rest-data-2.0';
import path from 'path';
import {LastFM} from '../../model/lastfm-rest-data-2.0';
import {JamRequest} from '../../api/jam/api';
import {TrackController} from '../../objects/track/track.controller';
import {AudioService} from '../audio/audio.service';

export class MetadataController {
	private cache: { [key: string]: any } = {};

	constructor(private audioService: AudioService, private trackController: TrackController) {
	}

	async brainzSearch(req: JamRequest<JamParameters.BrainzSearch>): Promise<MusicBrainz.Response> {
		const query = Object.assign({}, req.query);
		delete query.type;
		const key = 'search-' + req.query.type + JSON.stringify(query);
		if (this.cache[key]) {
			console.log('serving from cache search');
			return this.cache[key];
		}
		const brainz = await this.audioService.musicbrainzSearch(req.query.type, query);
		this.cache[key] = brainz;
		return brainz;
	}

	async acoustidLookup(req: JamRequest<JamParameters.AcoustidLookup>): Promise<Array<Acoustid.Result>> {
		const key = 'acoustid-' + req.query.id + req.query.inc;
		if (this.cache[key]) {
			console.log('serving from cache acoustid');
			return this.cache[key];
		}
		const track = await this.trackController.byID(req.query.id);
		const acoustid = await this.audioService.acoustidLookup(path.join(track.path, track.name), req.query.inc);
		this.cache[key] = acoustid;
		return acoustid;
	}

	async lastfmLookup(req: JamRequest<JamParameters.LastFMLookup>): Promise<LastFM.Result> {
		const key = 'lastfm-' + req.query.type + req.query.id;
		if (this.cache[key]) {
			console.log('serving from cache lastfm');
			return this.cache[key];
		}
		const lastfm = await this.audioService.lastFMLookup(req.query.type, req.query.id);
		this.cache[key] = lastfm;
		return lastfm;
	}

	async brainzLookup(req: JamRequest<JamParameters.BrainzLookup>): Promise<MusicBrainz.Response> {
		const key = 'lookup-' + req.query.type + req.query.id + req.query.inc;
		if (this.cache[key]) {
			console.log('serving from cache lookup');
			return this.cache[key];
		}
		const brainz = await this.audioService.musicbrainzLookup(req.query.type, req.query.id, req.query.inc);
		this.cache[key] = brainz;
		return brainz;
	}
}
