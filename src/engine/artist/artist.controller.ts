import {JamParameters} from '../../model/jam-rest-params-0.1.0';
import {Jam} from '../../model/jam-rest-data-0.1.0';
import {DBObjectType} from '../../types';
import {paginate} from '../../utils/paginate';
import {JamRequest} from '../../api/jam/api';
import {BaseListController} from '../list/base.list.controller';
import {TrackController} from '../track/track.controller';
import {AlbumController} from '../album/album.controller';
import {formatArtist, formatArtistInfo} from './artist.format';
import {formatState} from '../state/state.format';
import {formatArtistIndex} from '../index/index.format';
import {StateStore} from '../state/state.store';
import {MetaDataService} from '../metadata/metadata.service';
import {ArtistStore, SearchQueryArtist} from './artist.store';
import {TrackStore} from '../track/track.store';
import {AlbumStore} from '../album/album.store';
import {IndexService} from '../index/index.service';
import {DownloadService} from '../download/download.service';
import {ImageService} from '../image/image.service';
import {StateService} from '../state/state.service';
import {ListService} from '../list/list.service';
import {Artist} from './artist.model';
import {User} from '../user/user.model';

export class ArtistController extends BaseListController<JamParameters.Artist, JamParameters.Artists, JamParameters.IncludesArtist, SearchQueryArtist, JamParameters.ArtistSearch, Artist, Jam.Artist> {

	constructor(
		private artistStore: ArtistStore,
		private track: TrackController,
		private album: AlbumController,
		private metaDataService: MetaDataService,
		private albumStore: AlbumStore,
		private trackStore: TrackStore,
		private indexService: IndexService,
		protected stateStore: StateStore,
		protected stateService: StateService,
		protected imageService: ImageService,
		protected downloadService: DownloadService,
		protected listService: ListService
	) {
		super(artistStore, DBObjectType.artist, stateStore, stateService, imageService, downloadService, listService);
	}

	async prepare(artist: Artist, includes: JamParameters.IncludesArtist, user: User): Promise<Jam.Artist> {
		const result = formatArtist(artist, includes);
		if (includes.artistState) {
			const state = await this.stateStore.findOrCreate(artist.id, user.id, DBObjectType.artist);
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
			const tracks = await this.trackStore.byIds(artist.trackIDs);
			result.tracks = await this.track.prepareList(tracks, includes, user);
		}
		if (includes.artistAlbums) {
			const albums = await this.albumStore.byIds(artist.albumIDs);
			result.albums = await this.album.prepareList(albums, includes, user);
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
			genre: query.genre,
			newerThan: query.newerThan,
			fromYear: query.fromYear,
			toYear: query.toYear,
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
		return this.track.prepareList(paginate(tracks, req.query.amount, req.query.offset), req.query, req.user);
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
		return this.track.prepareListByIDs(trackIDs, req.query, req.user);
	}

}
