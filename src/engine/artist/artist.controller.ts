import {JamRequest} from '../../api/jam/api';
import {DBObjectType} from '../../db/db.types';
import {Jam} from '../../model/jam-rest-data';
import {JamParameters} from '../../model/jam-rest-params';
import {paginate} from '../../utils/paginate';
import {AlbumController} from '../album/album.controller';
import {Album} from '../album/album.model';
import {BaseListController} from '../base/dbobject-list.controller';
import {ListResult} from '../base/list-result';
import {DownloadService} from '../download/download.service';
import {ImageService} from '../image/image.service';
import {formatArtistIndex} from '../index/index.format';
import {IndexService} from '../index/index.service';
import {MetaDataService} from '../metadata/metadata.service';
import {formatState} from '../state/state.format';
import {StateService} from '../state/state.service';
import {TrackController} from '../track/track.controller';
import {Track} from '../track/track.model';
import {User} from '../user/user.model';
import {formatArtist} from './artist.format';
import {Artist} from './artist.model';
import {ArtistService} from './artist.service';
import {SearchQueryArtist} from './artist.store';

export class ArtistController extends BaseListController<JamParameters.Artist,
	JamParameters.Artists,
	JamParameters.IncludesArtist,
	SearchQueryArtist,
	JamParameters.ArtistSearch,
	Artist,
	Jam.Artist,
	JamParameters.ArtistList> {

	constructor(
		private artistService: ArtistService,
		private trackController: TrackController,
		private albumController: AlbumController,
		private metaDataService: MetaDataService,
		private indexService: IndexService,
		protected stateService: StateService,
		protected imageService: ImageService,
		protected downloadService: DownloadService
	) {
		super(artistService, stateService, imageService, downloadService);
	}

	defaultSort(items: Array<Artist>): Array<Artist> {
		return items.sort((a, b) => a.name.localeCompare(b.name));
	}

	sortArtistAlbums(a: Album, b: Album): number {
		let res = a.albumType.localeCompare(b.albumType);
		if (res === 0) {
			res = (b.year || 0) - (a.year || 0);
		}
		return res;
	}

	sortArtistTracks(a: Track, b: Track): number {
		let res = a.parentID.localeCompare(b.parentID);
		if (res === 0) {
			res = (b.tag.disc || 0) - (a.tag.disc || 0);
		}
		if (res === 0) {
			res = (b.tag.track || 0) - (a.tag.track || 0);
		}
		return res;
	}

	async prepare(artist: Artist, includes: JamParameters.IncludesArtist, user: User): Promise<Jam.Artist> {
		const result = formatArtist(artist, includes);
		if (includes.artistState) {
			const state = await this.stateService.findOrCreate(artist.id, user.id, DBObjectType.artist);
			result.state = formatState(state);
		}
		if (includes.artistInfo) {
			result.info = await this.metaDataService.getArtistInfo(artist);
		}
		if (includes.artistSimilar) {
			result.similar = await this.prepareList(await this.metaDataService.getSimilarArtists(artist), {}, user);
		}
		if (includes.artistTracks) {
			result.tracks = await this.trackController.prepareListByIDs(artist.trackIDs, includes, user, this.sortArtistTracks);
		}
		if (includes.artistAlbums) {
			result.albums = await this.albumController.prepareListByIDs(artist.albumIDs, includes, user, this.sortArtistAlbums);
		}
		return result;
	}

	async translateQuery(query: JamParameters.ArtistSearch, user: User): Promise<SearchQueryArtist> {
		return {
			query: query.query,
			id: query.id,
			ids: query.ids,
			name: query.name,
			rootID: query.rootID,
			rootIDs: query.rootIDs,
			albumID: query.albumID,
			mbArtistID: query.mbArtistID,
			albumType: query.albumType,
			albumTypes: query.albumTypes,
			newerThan: query.newerThan,
			// genre: query.genre,
			// fromYear: query.fromYear,
			// toYear: query.toYear,
			offset: query.offset,
			amount: query.amount,
			sorts: query.sortField ? [{field: query.sortField, descending: !!query.sortDescending}] : undefined
		};
	}

	async similar(req: JamRequest<JamParameters.SimilarArtists>): Promise<ListResult<Jam.Artist>> {
		const artist = await this.byID(req.query.id);
		const artists = await this.metaDataService.getSimilarArtists(artist);
		const list = paginate(artists, req.query.amount, req.query.offset);
		return {
			total: list.total,
			amount: list.amount,
			offset: list.offset,
			items: await this.prepareList(list.items, req.query, req.user)
		};
	}

	async similarTracks(req: JamRequest<JamParameters.SimilarTracks>): Promise<ListResult<Jam.Track>> {
		const artist = await this.byID(req.query.id);
		const tracks = await this.metaDataService.getArtistSimilarTracks(artist);
		const list = paginate(tracks, req.query.amount, req.query.offset);
		return {
			total: list.total,
			amount: list.amount,
			offset: list.offset,
			items: await this.trackController.prepareList(list.items, req.query, req.user)
		};
	}

	async index(req: JamRequest<JamParameters.ArtistSearchQuery>): Promise<Jam.ArtistIndex> {
		return formatArtistIndex(await this.indexService.getArtistIndex(await this.translateQuery(req.query, req.user)));
	}

	async tracks(req: JamRequest<JamParameters.ArtistTracks>): Promise<ListResult<Jam.Track>> {
		const artists = await this.byIDs(req.query.ids);
		let trackIDs: Array<string> = [];
		artists.forEach(artist => {
			trackIDs = trackIDs.concat(artist.trackIDs);
		});
		const list = paginate(trackIDs, req.query.amount, req.query.offset);
		return {
			total: list.total,
			amount: list.amount,
			offset: list.offset,
			items: await this.trackController.prepareListByIDs(list.items, req.query, req.user, this.sortArtistTracks)
		};
	}

	async info(req: JamRequest<JamParameters.ID>): Promise<Jam.Info> {
		const artist = await this.byID(req.query.id);
		return {info: await this.metaDataService.getArtistInfo(artist)};
	}
}
