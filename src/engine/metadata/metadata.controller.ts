import {JamParameters} from '../../model/jam-rest-params';
import {MusicBrainz} from '../../model/musicbrainz-rest-data';
import {Acoustid} from '../../model/acoustid-rest-data';
import path from 'path';
import {LastFM} from '../../model/lastfm-rest-data';
import {JamRequest} from '../../api/jam/api';
import {TrackController} from '../../objects/track/track.controller';
import {AudioModule} from '../../modules/audio/audio.module';
import {AcousticBrainz} from '../../model/acousticbrainz-rest-data';

export class MetadataController {
	private cache: { [key: string]: any } = {};

	constructor(private audioModule: AudioModule, private trackController: TrackController) {
	}

	async musicbrainzSearch(req: JamRequest<JamParameters.MusicBrainzSearch>): Promise<MusicBrainz.Response> {
		const query = Object.assign({}, req.query);
		delete query.type;
		const key = 'search-' + req.query.type + JSON.stringify(query);
		if (this.cache[key]) {
			console.log('serving from cache search');
			return this.cache[key];
		}
		const brainz = await this.audioModule.musicbrainzSearch(req.query.type, query);
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
		const acoustid = await this.audioModule.acoustidLookup(path.join(track.path, track.name), req.query.inc);
		this.cache[key] = acoustid;
		return acoustid;
	}

	async lastfmLookup(req: JamRequest<JamParameters.LastFMLookup>): Promise<LastFM.Result> {
		const key = 'lastfm-' + req.query.type + req.query.id;
		if (this.cache[key]) {
			console.log('serving from cache lastfm');
			return this.cache[key];
		}
		const lastfm = await this.audioModule.lastFMLookup(req.query.type, req.query.id);
		this.cache[key] = lastfm;
		return lastfm;
	}

	async acousticbrainzLookup(req: JamRequest<JamParameters.AcousticBrainzLookup>): Promise<AcousticBrainz.Response> {
		const key = 'acousticbrainz-lookup-' + req.query.id + req.query.nr;
		if (this.cache[key]) {
			console.log('serving from cache lookup');
			return this.cache[key];
		}
		const abrainz = await this.audioModule.acousticbrainzLookup(req.query.id, req.query.nr);
		this.cache[key] = abrainz;
		return abrainz;
	}

	async musicbrainzLookup(req: JamRequest<JamParameters.MusicBrainzLookup>): Promise<MusicBrainz.Response> {
		const key = 'lookup-' + req.query.type + req.query.id + req.query.inc;
		if (this.cache[key]) {
			console.log('serving from cache lookup');
			return this.cache[key];
		}
		const brainz = await this.audioModule.musicbrainzLookup(req.query.type, req.query.id, req.query.inc);
		this.cache[key] = brainz;
		return brainz;
	}
}
