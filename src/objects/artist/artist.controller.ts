import {JamParameters} from '../../model/jam-rest-params-0.1.0';
import {Jam} from '../../model/jam-rest-data-0.1.0';
import {DBObjectType} from '../../types';
import {paginate} from '../../utils/paginate';
import {JamRequest} from '../../api/jam/api';
import {BaseListController} from '../base/base.list.controller';
import {TrackController} from '../track/track.controller';
import {AlbumController} from '../album/album.controller';
import {formatArtist, formatArtistInfo} from './artist.format';
import {formatState} from '../state/state.format';
import {formatArtistIndex} from '../../engine/index/index.format';
import {MetaDataService} from '../../engine/metadata/metadata.service';
import {ArtistStore, SearchQueryArtist} from './artist.store';
import {IndexService} from '../../engine/index/index.service';
import {DownloadService} from '../../engine/download/download.service';
import {ImageService} from '../../engine/image/image.service';
import {StateService} from '../state/state.service';
import {ListService} from '../../engine/list/list.service';
import {Artist} from './artist.model';
import {User} from '../user/user.model';

export class ArtistController extends BaseListController<JamParameters.Artist, JamParameters.Artists, JamParameters.IncludesArtist, SearchQueryArtist, JamParameters.ArtistSearch, Artist, Jam.Artist> {

	constructor(
		private artistStore: ArtistStore,
		private trackController: TrackController,
		private albumController: AlbumController,
		private metaDataService: MetaDataService,
		private indexService: IndexService,
		protected stateService: StateService,
		protected imageService: ImageService,
		protected downloadService: DownloadService,
		protected listService: ListService
	) {
		super(artistStore, DBObjectType.artist, stateService, imageService, downloadService, listService);
	}

	defaultSort(items: Array<Artist>): Array<Artist> {
		return items.sort((a, b) => a.name.localeCompare(b.name));
	}

	async prepare(artist: Artist, includes: JamParameters.IncludesArtist, user: User): Promise<Jam.Artist> {
		const result = formatArtist(artist, includes);
		if (includes.artistState) {
			const state = await this.stateService.findOrCreate(artist.id, user.id, DBObjectType.artist);
			result.state = formatState(state);
		}
		if (includes.artistInfo) {
			const infos = await this.metaDataService.getArtistInfos(artist, false, !!includes.artistInfoSimilar);
			result.info = formatArtistInfo(infos.info);
			if (includes.artistInfoSimilar) {
				const similar: Array<Jam.Artist> = [];
				(infos.similar || []).forEach(sim => {
					if (sim.artist) {
						similar.push(formatArtist(sim.artist, includes));
					}
				});
				result.info.similar = similar;
			}
		}
		if (includes.artistTracks) {
			result.tracks = await this.trackController.prepareListByIDs(artist.trackIDs, includes, user);
		}
		if (includes.artistAlbums) {
			result.albums = await this.albumController.prepareListByIDs(artist.albumIDs, includes, user);
		}
		return result;
	}

	translateQuery(query: JamParameters.ArtistSearch, user: User): SearchQueryArtist {
		return {
			query: query.query,
			name: query.name,
			rootID: query.rootID,
			albumID: query.albumID,
			mbArtistID: query.mbArtistID,
			// genre: query.genre,
			newerThan: query.newerThan,
			// fromYear: query.fromYear,
			// toYear: query.toYear,
			offset: query.offset,
			amount: query.amount,
			sorts: query.sortField ? [{field: query.sortField, descending: !!query.sortDescending}] : undefined
		};
	}

	async similar(req: JamRequest<JamParameters.Artist>): Promise<Array<Jam.Artist>> {
		const artist = await this.byID(req.query.id);
		const artistInfo = await this.metaDataService.getArtistInfos(artist, false, true);
		const list = (artistInfo.similar || []).filter(s => !!s.artist).map(s => <Artist>s.artist);
		return this.prepareList(list, req.query, req.user);
	}

	async similarTracks(req: JamRequest<JamParameters.SimilarTracks>): Promise<Array<Jam.Track>> {
		const artist = await this.byID(req.query.id);
		const tracks = await this.metaDataService.getArtistSimilarTracks(artist);
		return this.trackController.prepareList(paginate(tracks, req.query.amount, req.query.offset), req.query, req.user);
	}

	async list(req: JamRequest<JamParameters.ArtistList>): Promise<Array<Jam.Artist>> {
		return this.getList(req.query, req.query, req.query, req.user);
	}

	async index(req: JamRequest<JamParameters.Index>): Promise<Jam.ArtistIndex> {
		const artistIndex = await this.indexService.getArtistIndex();
		return formatArtistIndex(this.indexService.filterArtistIndex(req.query.rootID, artistIndex));
	}

	async tracks(req: JamRequest<JamParameters.Tracks>): Promise<Array<Jam.Track>> {
		const artists = await this.byIDs(req.query.ids);
		let trackIDs: Array<string> = [];
		artists.forEach(artist => {
			trackIDs = trackIDs.concat(artist.trackIDs);
		});
		return this.trackController.prepareListByIDs(trackIDs, req.query, req.user);
	}

}
