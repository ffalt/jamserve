import {JamParameters} from '../../model/jam-rest-params';
import {Jam} from '../../model/jam-rest-data';
import {DBObjectType} from '../../db/db.types';
import {paginate} from '../../utils/paginate';
import {JamRequest} from '../../api/jam/api';
import {BaseListController} from '../base/base.list.controller';
import {TrackController} from '../track/track.controller';
import {AlbumController} from '../album/album.controller';
import {formatArtist} from './artist.format';
import {formatState} from '../state/state.format';
import {formatArtistIndex} from '../../engine/index/index.format';
import {MetaDataService} from '../metadata/metadata.service';
import {SearchQueryArtist} from './artist.store';
import {IndexService} from '../../engine/index/index.service';
import {DownloadService} from '../../engine/download/download.service';
import {ImageService} from '../../engine/image/image.service';
import {StateService} from '../state/state.service';
import {Artist} from './artist.model';
import {User} from '../user/user.model';
import {ArtistService} from './artist.service';
import {Album} from '../album/album.model';
import {Track} from '../track/track.model';

export class ArtistController extends BaseListController<JamParameters.Artist, JamParameters.Artists, JamParameters.IncludesArtist, SearchQueryArtist, JamParameters.ArtistSearch, Artist, Jam.Artist> {

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
			name: query.name,
			rootID: query.rootID,
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

	async similar(req: JamRequest<JamParameters.Artist>): Promise<Array<Jam.Artist>> {
		const artist = await this.byID(req.query.id);
		const list = await this.metaDataService.getSimilarArtists(artist);
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

	async index(req: JamRequest<JamParameters.ArtistSearchQuery>): Promise<Jam.ArtistIndex> {
		return formatArtistIndex(await this.indexService.getArtistIndex(await this.translateQuery(req.query, req.user)));
	}

	async tracks(req: JamRequest<JamParameters.Tracks>): Promise<Array<Jam.Track>> {
		const artists = await this.byIDs(req.query.ids);
		let trackIDs: Array<string> = [];
		artists.forEach(artist => {
			trackIDs = trackIDs.concat(artist.trackIDs);
		});
		return this.trackController.prepareListByIDs(trackIDs, req.query, req.user, this.sortArtistTracks);
	}

	async info(req: JamRequest<JamParameters.ID>): Promise<Jam.Info> {
		const artist = await this.byID(req.query.id);
		return {info: await this.metaDataService.getArtistInfo(artist)};
	}
}
