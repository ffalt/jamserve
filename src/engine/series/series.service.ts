import {ApiBinaryResult} from '../../typings';
import {BaseListService} from '../base/dbobject-list.service';
import {FolderService} from '../folder/folder.service';
import {StateService} from '../state/state.service';
import {TrackStore} from '../track/track.store';
import {Series} from './series.model';
import {SearchQuerySeries, SeriesStore} from './series.store';

export class SeriesService extends BaseListService<Series, SearchQuerySeries> {

	constructor(public seriesStore: SeriesStore, private trackStore: TrackStore, private folderService: FolderService, stateService: StateService) {
		super(seriesStore, stateService);
	}

	defaultSort(items: Array<Series>): Array<Series> {
		return items.sort((a, b) => a.name.localeCompare(b.name));
	}

	async getImage(series: Series, size?: number, format?: string): Promise<ApiBinaryResult | undefined> {
		const folders = await this.folderService.folderStore.byIds(series.folderIDs);
		folders.sort((a, b) => a.tag.level - b.tag.level);
		for (const folder of folders) {
			const result = this.folderService.getImage(folder, size, format);
			if (result) {
				return result;
			}
		}
	}

}
