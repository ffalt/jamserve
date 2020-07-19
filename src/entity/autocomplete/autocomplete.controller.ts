import {Controller, CurrentUser, Get, QueryParams} from '../../modules/rest/decorators';
import {AutoComplete} from './autocomplete.model';
import {Inject} from 'typescript-ioc';
import {OrmService} from '../../modules/engine/services/orm.service';
import {User} from '../user/user';
import {UserRole} from '../../types/enums';
import {AutoCompleteFilterArgs} from './autocomplete.args';

@Controller('/autocomplete', {tags: ['Various'], roles: [UserRole.stream]})
export class AutocompleteController {
	@Inject
	private orm!: OrmService;

	@Get(
		() => AutoComplete,
		{description: 'Get compact Search Results for Autocomplete Features', summary: 'Get Autocomplete'}
	)
	async autocomplete(
		@QueryParams() filter: AutoCompleteFilterArgs,
		@CurrentUser() user: User
	): Promise<AutoComplete> {
		const result: AutoComplete = {};
		const {query} = filter;
		if (filter.track !== undefined && filter.track > 0) {
			const list = await this.orm.Track.findFilter({query}, {limit: filter.track}, user);
			await this.orm.Track.populate(list, 'tag');
			result.tracks = list.map(o => ({id: o.id, name: o.tag?.title || o.name || ''}));
		}
		if (filter.album !== undefined && filter.album > 0) {
			const list = await this.orm.Album.findFilter({query}, {limit: filter.album}, user);
			result.albums = list.map(o => ({id: o.id, name: o.name}));
		}
		if (filter.artist !== undefined && filter.artist > 0) {
			const list = await this.orm.Artist.findFilter({query}, {limit: filter.artist}, user);
			result.artists = list.map(o => ({id: o.id, name: o.name}));
		}
		if (filter.folder !== undefined && filter.folder > 0) {
			const list = await this.orm.Folder.findFilter({query}, {limit: filter.folder}, user);
			result.folders = list.map(o => ({id: o.id, name: o.name}));
		}
		if (filter.playlist !== undefined && filter.playlist > 0) {
			const list = await this.orm.Playlist.findFilter({query}, {limit: filter.playlist}, user);
			result.playlists = list.map(o => ({id: o.id, name: o.name}));
		}
		if (filter.podcast !== undefined && filter.podcast > 0) {
			const list = await this.orm.Podcast.findFilter({query}, {limit: filter.podcast}, user);
			result.podcasts = list.map(o => ({id: o.id, name: o.title || ''}));
		}
		if (filter.episode !== undefined && filter.episode > 0) {
			const list = await this.orm.Episode.findFilter({query}, {limit: filter.episode}, user);
			result.episodes = list.map(o => ({id: o.id, name: o.name}));
		}
		if (filter.series !== undefined && filter.series > 0) {
			const list = await this.orm.Series.findFilter({query}, {limit: filter.series}, user);
			result.series = list.map(o => ({id: o.id, name: o.name}));
		}
		return result;
	}
}
