import {Arg, Ctx, ID, Query, Resolver} from 'type-graphql';
import {Context} from '../../modules/server/middlewares/apollo.context.js';
import {ExtendedInfoQL, ExtendedInfoResult, ExtendedInfoResultQL} from './metadata.model.js';
import {FolderType} from '../../types/enums.js';

@Resolver(ExtendedInfoQL)
export class MetadataResolver {
	@Query(() => ExtendedInfoResultQL, {description: 'Get Extended Info for Folder by Id'})
	async folderInfo(@Arg('id', () => ID!) id: string, @Ctx() {orm, engine}: Context): Promise<ExtendedInfoResult> {
		const folder = await orm.Folder.oneOrFailByID(id);
		if (folder.folderType === FolderType.artist) {
			return {info: await engine.metadata.extInfo.byFolderArtist(orm, folder)};
		} else {
			return {info: await engine.metadata.extInfo.byFolderArtist(orm, folder)};
		}
	}

	@Query(() => ExtendedInfoResultQL, {description: 'Get Extended Info for Artist by Id'})
	async artistInfo(@Arg('id', () => ID!) id: string, @Ctx() {orm, engine}: Context): Promise<ExtendedInfoResult> {
		const artist = await orm.Artist.oneOrFailByID(id);
		return {info: await engine.metadata.extInfo.byArtist(orm, artist)};
	}

	@Query(() => ExtendedInfoResultQL, {description: 'Get Extended Info for Album by Id'})
	async albumInfo(@Arg('id', () => ID!) id: string, @Ctx() {orm, engine}: Context): Promise<ExtendedInfoResult> {
		const album = await orm.Album.oneOrFailByID(id);
		return {info: await engine.metadata.extInfo.byAlbum(orm, album)};
	}

	@Query(() => ExtendedInfoResultQL, {description: 'Get Extended Info for Series by Id'})
	async seriesInfo(@Arg('id', () => ID!) id: string, @Ctx() {orm, engine}: Context): Promise<ExtendedInfoResult> {
		const series = await orm.Series.oneOrFailByID(id);
		return {info: await engine.metadata.extInfo.bySeries(orm, series)};
	}
}
