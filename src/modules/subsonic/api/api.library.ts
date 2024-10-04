import { logger } from '../../../utils/logger.js';
import { SubsonicApiBase } from './api.base.js';
import { SubsonicRoute } from '../decorators/SubsonicRoute.js';
import { Context } from '../../engine/rest/context.js';
import { SubsonicOKResponse, SubsonicResponseScanStatus } from '../model/subsonic-rest-data.js';
import { SubsonicController } from '../decorators/SubsonicController.js';
import { SubsonicCtx } from '../decorators/SubsonicContext.js';

const log = logger('SubsonicApi');

@SubsonicController()
export class SubsonicLibraryApi extends SubsonicApiBase {
	/**
	 * Returns the current status for media library scanning. Takes no extra parameters.
	 * Since 1.15.0
	 * http://your-server/rest/getScanStatus.view
	 * @return Returns a <subsonic-response> element with a nested <scanStatus> element on success.
	 */
	@SubsonicRoute('/getScanStatus.view', () => SubsonicResponseScanStatus, {
		summary: 'Scan Status',
		description: 'Returns the current status for media library scanning.',
		tags: ['Admin']
	})
	async getScanStatus(@SubsonicCtx() { engine }: Context): Promise<SubsonicResponseScanStatus> {
		return { scanStatus: { scanning: engine.io.scanning, count: undefined } };
	}

	/**
	 * Initiates a rescan of the media libraries. Takes no extra parameters.
	 * Since 1.15.0
	 * http://your-server/rest/startScan.view
	 * @return Returns a <subsonic-response> element with a nested <scanStatus> element on success.
	 */
	@SubsonicRoute('/startScan.view', () => SubsonicOKResponse, {
		summary: 'Start Status',
		description: 'Initiates a rescan of the media libraries. Takes no extra parameters.',
		tags: ['Admin']
	})
	async startScan(@SubsonicCtx() { engine, orm }: Context): Promise<SubsonicOKResponse> {
		engine.io.root.startUpRefresh(orm, true).catch(e => log.error(e)); // do not wait;
		return {};
	}
}
