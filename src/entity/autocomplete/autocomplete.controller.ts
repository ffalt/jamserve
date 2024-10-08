import { AutoComplete } from './autocomplete.model.js';
import { UserRole } from '../../types/enums.js';
import { AutoCompleteFilterArgs } from './autocomplete.args.js';
import { Context } from '../../modules/engine/rest/context.js';
import { Controller } from '../../modules/rest/decorators/Controller.js';
import { Get } from '../../modules/rest/decorators/Get.js';
import { QueryParams } from '../../modules/rest/decorators/QueryParams.js';
import { Ctx } from '../../modules/rest/decorators/Ctx.js';

@Controller('/autocomplete', { tags: ['Various'], roles: [UserRole.stream] })
export class AutocompleteController {
	@Get(
		() => AutoComplete,
		{ description: 'Get compact Search Results for Autocomplete Features', summary: 'Get Autocomplete' }
	)
	async autocomplete(
		@QueryParams() filter: AutoCompleteFilterArgs,
		@Ctx() { orm, user }: Context
	): Promise<AutoComplete> {
		const result: AutoComplete = {};
		const { query } = filter;
		if (filter.track !== undefined && filter.track > 0) {
			const list = await orm.Track.findFilter({ query }, [], { take: filter.track }, user);
			result.tracks = [];
			for (const track of list) {
				const tag = await track.tag.get();
				result.tracks.push({ id: track.id, name: tag?.title || track.name || '' });
			}
		}
		if (filter.album !== undefined && filter.album > 0) {
			const list = await orm.Album.findFilter({ query }, [], { take: filter.album }, user);
			result.albums = list.map(o => ({ id: o.id, name: o.name }));
		}
		if (filter.artist !== undefined && filter.artist > 0) {
			const list = await orm.Artist.findFilter({ query }, [], { take: filter.artist }, user);
			result.artists = list.map(o => ({ id: o.id, name: o.name }));
		}
		if (filter.folder !== undefined && filter.folder > 0) {
			const list = await orm.Folder.findFilter({ query }, [], { take: filter.folder }, user);
			result.folders = list.map(o => ({ id: o.id, name: o.name }));
		}
		if (filter.playlist !== undefined && filter.playlist > 0) {
			const list = await orm.Playlist.findFilter({ query }, [], { take: filter.playlist }, user);
			result.playlists = list.map(o => ({ id: o.id, name: o.name }));
		}
		if (filter.podcast !== undefined && filter.podcast > 0) {
			const list = await orm.Podcast.findFilter({ query }, [], { take: filter.podcast }, user);
			result.podcasts = list.map(o => ({ id: o.id, name: o.title || '' }));
		}
		if (filter.episode !== undefined && filter.episode > 0) {
			const list = await orm.Episode.findFilter({ query }, [], { take: filter.episode }, user);
			result.episodes = list.map(o => ({ id: o.id, name: o.name }));
		}
		if (filter.series !== undefined && filter.series > 0) {
			const list = await orm.Series.findFilter({ query }, [], { take: filter.series }, user);
			result.series = list.map(o => ({ id: o.id, name: o.name }));
		}
		return result;
	}
}
