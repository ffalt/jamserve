import moment from 'moment';
import {logger} from '../../../utils/logger';
import {Changes} from './changes';

const log = logger('IO');

export function logChanges(changes: Changes): void {

	function logChange(name: string, list: Array<any>): void {
		if (list.length > 0) {
			log.info(name, list.length);
		}
	}

	const v = moment.utc(changes.end - changes.start).format('HH:mm:ss.SSS');
	log.info('Duration:', v);
	logChange('Added Tracks', changes.newTracks);
	logChange('Updated Tracks', changes.updateTracks);
	logChange('Removed Tracks', changes.removedTracks);
	logChange('Added Folders', changes.newFolders);
	logChange('Updated Folders', changes.updateFolders);
	logChange('Removed Folders', changes.removedFolders);
	logChange('Added Artists', changes.newArtists);
	logChange('Updated Artists', changes.updateArtists);
	logChange('Removed Artists', changes.removedArtists);
	logChange('Added Albums', changes.newAlbums);
	logChange('Updated Albums', changes.updateAlbums);
	logChange('Removed Albums', changes.removedAlbums);
	logChange('Added Series', changes.newSeries);
	logChange('Updated Series', changes.updateSeries);
	logChange('Removed Series', changes.removedSeries);
}
