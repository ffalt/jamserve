import { logger } from '../../../utils/logger.js';
import { SubsonicApiBase } from './api.base.js';
import { SubsonicRoute } from '../decorators/SubsonicRoute.js';
import { Context } from '../../engine/rest/context.js';
import { SubsonicResponseScanStatus } from '../model/subsonic-rest-data.js';

const log = logger('SubsonicApi');

export class SubsonicLibraryApi extends SubsonicApiBase {
	/**
	 * Returns the current status for media library scanning. Takes no extra parameters.
	 * Since 1.15.0
	 * http://your-server/rest/getScanStatus.view
	 * @return Returns a <subsonic-response> element with a nested <scanStatus> element on success.
	 */
	@SubsonicRoute('getScanStatus.view', () => SubsonicResponseScanStatus)
	async getScanStatus(_query: unknown, { engine }: Context): Promise<SubsonicResponseScanStatus> {
		return { scanStatus: { scanning: engine.io.scanning, count: undefined } };
	}

	/**
	 * Initiates a rescan of the media libraries. Takes no extra parameters.
	 * Since 1.15.0
	 * http://your-server/rest/startScan.view
	 * @return Returns a <subsonic-response> element with a nested <scanStatus> element on success.
	 */
	@SubsonicRoute('startScan.view')
	async startScan(_query: unknown, { engine, orm }: Context): Promise<void> {
		engine.io.root.startUpRefresh(orm, true).catch(e => log.error(e)); // do not wait;
	}
}
