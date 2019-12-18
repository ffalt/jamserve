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
import {SeriesController} from '../series/series.controller';
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
		public artistService: ArtistService,
		private trackController: TrackController,
		private seriesController: SeriesController,
		private albumController: AlbumController,
		private metaDataService: MetaDataService,
		private indexService: IndexService,
		protected stateService: StateService,
		protected imageService: ImageService,
		protected downloadService: DownloadService
	) {
		super(artistService, stateService, imageService, downloadService);
	}

	static sortGrouping(a: string, b: string): number {
		const aNr = Number(a);
		const bNr = Number(b);
		if (isNaN(aNr) || isNaN(bNr)) {
			return (a || '').localeCompare(b || '');
		}
		return aNr - bNr;
	}

	static sortArtistAlbums(a: Album, b: Album): number {
		let res = a.albumType.localeCompare(b.albumType);
		if (res === 0) {
			if (a.seriesNr && b.seriesNr) {
				res = ArtistController.sortGrouping(a.seriesNr, b.seriesNr);
			} else if (a.seriesNr || b.seriesNr) {
				res = a.seriesNr ? 1 : -1;
			}
		}
		if (res === 0) {
			res = (b.year || 0) - (a.year || 0);
		}
		if (res === 0) {
			res = a.name.localeCompare(b.name);
		}
		return res;
	}

	static sortArtistTracks(a: Track, b: Track): number {
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
			try {
				result.info = await this.metaDataService.extInfo.byArtist(artist);
			} catch (e) {
				result.info = undefined;
			}
		}
		if (includes.artistSimilar) {
			try {
				result.similar = await this.prepareList(await this.metaDataService.similarArtists.byArtist(artist), {}, user);
			} catch (e) {
				result.similar = undefined;
			}
		}
		if (includes.artistTracks) {
			result.tracks = await this.trackController.prepareListByIDs(artist.trackIDs, includes, user, ArtistController.sortArtistTracks);
		}
		if (includes.artistAlbums) {
			result.albums = await this.albumController.prepareListByIDs(artist.albumIDs, includes, user, ArtistController.sortArtistAlbums);
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
			genre: query.genre,
			// fromYear: query.fromYear,
			// toYear: query.toYear,
			offset: query.offset,
			amount: query.amount,
			sorts: query.sortField ? [{field: query.sortField, descending: !!query.sortDescending}] : undefined
		};
	}

	async similar(req: JamRequest<JamParameters.SimilarArtists>): Promise<ListResult<Jam.Artist>> {
		const artist = await this.byID(req.query.id);
		try {
			const artists = await this.metaDataService.similarArtists.byArtist(artist);
			const list = paginate(artists, req.query.amount, req.query.offset);
			return {
				total: list.total,
				amount: list.amount,
				offset: list.offset,
				items: await this.prepareList(list.items, req.query, req.user)
			};
		} catch (e) {
			return {items: []};
		}
	}

	async similarTracks(req: JamRequest<JamParameters.SimilarTracks>): Promise<ListResult<Jam.Track>> {
		const artist = await this.byID(req.query.id);
		try {
			const tracks = await this.metaDataService.similarTracks.byArtist(artist);
			const list = paginate(tracks, req.query.amount, req.query.offset);
			return {
				total: list.total,
				amount: list.amount,
				offset: list.offset,
				items: await this.trackController.prepareList(list.items, req.query, req.user)
			};
		} catch (e) {
			return {items: []};
		}
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
			items: await this.trackController.prepareListByIDs(list.items, req.query, req.user, ArtistController.sortArtistTracks)
		};
	}

	async albums(req: JamRequest<JamParameters.ArtistAlbums>): Promise<ListResult<Jam.Album>> {
		const artists = await this.byIDs(req.query.ids);
		let albumIDs: Array<string> = [];
		artists.forEach(artist => {
			albumIDs = albumIDs.concat(artist.albumIDs);
		});
		const list = paginate(albumIDs, req.query.amount, req.query.offset);
		return {
			total: list.total,
			amount: list.amount,
			offset: list.offset,
			items: await this.albumController.prepareListByIDs(list.items, req.query, req.user, ArtistController.sortArtistAlbums)
		};
	}

	async info(req: JamRequest<JamParameters.ID>): Promise<Jam.Info> {
		const artist = await this.byID(req.query.id);
		return {info: await this.metaDataService.extInfo.byArtist(artist)};
	}

	async series(req: JamRequest<JamParameters.ArtistSeries>): Promise<ListResult<Jam.Series>> {
		const artists = await this.byIDs(req.query.ids);
		let seriesIDs: Array<string> = [];
		artists.forEach(artist => {
			seriesIDs = seriesIDs.concat(artist.seriesIDs);
		});
		const list = paginate(seriesIDs, req.query.amount, req.query.offset);
		return {
			total: list.total,
			amount: list.amount,
			offset: list.offset,
			items: await this.seriesController.prepareListByIDs(list.items, req.query, req.user)
		};
	}
}
