import {Stats} from './stats.model';
import {Inject, Singleton} from 'typescript-ioc';
import {OrmService} from '../../modules/engine/services/orm.service';
import {AlbumType} from '../../types/enums';
import {MUSICBRAINZ_VARIOUS_ARTISTS_ID} from '../../types/consts';
import {QBFilterQuery} from 'mikro-orm/dist/typings';
import {QHelper} from '../base/base';

@Singleton
export class StatsService {
	private stats: Array<Stats> = [];
	@Inject
	private orm!: OrmService;

	async refresh(): Promise<void> {
		this.stats = [];
	}

	async getStats(rootID?: string): Promise<Stats> {
		let stat = this.stats.find(s => s.rootID === rootID);
		if (!stat) {
			const inAlbumTypes = (albumType: AlbumType): QBFilterQuery => {
				return QHelper.inStringArray('albumTypes', [albumType])[0];
			}
			let rootsWhere = {};
			let rootWhere = {};
			if (rootID) {
				rootsWhere = {roots: {id: rootID}};
				rootWhere = {root: {id: rootID}};
			}
			stat = {
				rootID,
				album: await this.orm.Album.count(rootsWhere),
				series: await this.orm.Series.count(rootsWhere),
				albumTypes: {
					album: await this.orm.Album.count({...rootsWhere, albumType: {$eq: AlbumType.album}}),
					compilation: await this.orm.Album.count({...rootsWhere, albumType: {$eq: AlbumType.compilation}, mbArtistID: {$eq: MUSICBRAINZ_VARIOUS_ARTISTS_ID}}),
					artistCompilation: await this.orm.Album.count({...rootsWhere, albumType: {$eq: AlbumType.compilation}, mbArtistID: {$ne: MUSICBRAINZ_VARIOUS_ARTISTS_ID}}),
					audiobook: await this.orm.Album.count({...rootsWhere, albumType: {$eq: AlbumType.audiobook}}),
					series: await this.orm.Album.count({...rootsWhere, albumType: {$eq: AlbumType.series}}),
					soundtrack: await this.orm.Album.count({...rootsWhere, albumType: {$eq: AlbumType.soundtrack}}),
					bootleg: await this.orm.Album.count({...rootsWhere, albumType: {$eq: AlbumType.bootleg}}),
					live: await this.orm.Album.count({...rootsWhere, albumType: {$eq: AlbumType.live}}),
					ep: await this.orm.Album.count({...rootsWhere, albumType: {$eq: AlbumType.ep}}),
					unknown: await this.orm.Album.count({...rootsWhere, albumType: {$eq: AlbumType.unknown}}),
					single: await this.orm.Album.count({...rootsWhere, albumType: {$eq: AlbumType.single}})
				},
				artist: await this.orm.Artist.count(rootsWhere),
				artistTypes: {
					album: await this.orm.Artist.count({...rootsWhere, ...inAlbumTypes(AlbumType.album)}),
					compilation: await this.orm.Artist.count({...rootsWhere, ...inAlbumTypes(AlbumType.compilation), mbArtistID: {$eq: MUSICBRAINZ_VARIOUS_ARTISTS_ID}}),
					artistCompilation: await this.orm.Artist.count({...rootsWhere, ...inAlbumTypes(AlbumType.compilation), mbArtistID: {$ne: MUSICBRAINZ_VARIOUS_ARTISTS_ID}}),
					audiobook: await this.orm.Artist.count({...rootsWhere, ...inAlbumTypes(AlbumType.audiobook)}),
					series: await this.orm.Artist.count({...rootsWhere, ...inAlbumTypes(AlbumType.series)}),
					soundtrack: await this.orm.Artist.count({...rootsWhere, ...inAlbumTypes(AlbumType.soundtrack)}),
					bootleg: await this.orm.Artist.count({...rootsWhere, ...inAlbumTypes(AlbumType.bootleg)}),
					live: await this.orm.Artist.count({...rootsWhere, ...inAlbumTypes(AlbumType.live)}),
					ep: await this.orm.Artist.count({...rootsWhere, ...inAlbumTypes(AlbumType.ep)}),
					unknown: await this.orm.Artist.count({...rootsWhere, ...inAlbumTypes(AlbumType.unknown)}),
					single: await this.orm.Artist.count({...rootsWhere, ...inAlbumTypes(AlbumType.single)})
				},
				folder: await this.orm.Folder.count(rootWhere),
				track: await this.orm.Track.count(rootWhere)
			};
			this.stats.push(stat);
		}
		return stat;
	}

}
