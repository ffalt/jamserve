import {Subsonic} from '../../../model/subsonic-rest-data';
import {logger} from '../../../utils/logger';
import {ApiOptions, SubsonicApiBase} from '../base';

const log = logger('SubsonicApi');

export class SubsonicLibraryApi extends SubsonicApiBase {

	/**
	 * Returns the current status for media library scanning. Takes no extra parameters.
	 * Since 1.15.0
	 * http://your-server/rest/getScanStatus.view
	 * @return Returns a <subsonic-response> element with a nested <scanStatus> element on success.
	 */
	async getScanStatus(req: ApiOptions<{}>): Promise<{ scanStatus: Subsonic.ScanStatus }> {
		return {scanStatus: this.engine.ioService.getScanStatus()};
	}

	/**
	 * Initiates a rescan of the media libraries. Takes no extra parameters.
	 * Since 1.15.0
	 * http://your-server/rest/startScan.view
	 * @return Returns a <subsonic-response> element with a nested <scanStatus> element on success.
	 */
	async startScan(req: ApiOptions<{}>): Promise<void> {
		this.engine.ioService.refresh().catch(e => log.error(e)); // do not wait;
	}

}
