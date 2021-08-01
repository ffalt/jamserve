import nock from 'nock';
import {configureLogger} from '../utils/logger';

export function initTest(): void {
	nock.disableNetConnect();
	nock.enableNetConnect(/(localhost|0.0.0.0)/);
	configureLogger('none');
}
