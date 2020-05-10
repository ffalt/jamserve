import {ApiBinaryResult} from '../../typings';
import {BaseListService} from '../base/dbobject-list.service';
import {FolderService} from '../folder/folder.service';
import {StateService} from '../state/state.service';
import {TrackStore} from '../track/track.store';
import {Series} from './series.model';
import {SearchQuerySeries, SeriesStore} from './series.store';
import {Album} from '../album/album.model';
import {Track} from '../track/track.model';

export class SeriesService extends BaseListService<Series, SearchQuerySeries> {

	constructor(public seriesStore: SeriesStore, private trackStore: TrackStore, private folderService: FolderService, stateService: StateService) {
		super(seriesStore, stateService);
	}

	static sortGrouping(a: string, b: string): number {
		const aNr = Number(a);
		const bNr = Number(b);
		if (isNaN(aNr) || isNaN(bNr)) {
			return (a || '').localeCompare(b || '');
		}
		return aNr - bNr;
	}

	static sortSeriesAlbums(a: Album, b: Album): number {
		let res = a.albumType.localeCompare(b.albumType);
		if (res === 0) {
			if (a.seriesNr && b.seriesNr) {
				res = SeriesService.sortGrouping(a.seriesNr, b.seriesNr);
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

	static sortSeriesTracks(a: Track, b: Track): number {
		let res = a.parentID.localeCompare(b.parentID);
		if (res === 0) {
			res = (b.tag.disc || 0) - (a.tag.disc || 0);
		}
		if (res === 0) {
			res = (b.tag.track || 0) - (a.tag.track || 0);
		}
		return res;
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
