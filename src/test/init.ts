import nock from 'nock';
import {configureLogger} from '../utils/logger';

export function initTest() {
	nock.disableNetConnect();
	nock.enableNetConnect(/(localhost|0.0.0.0)/);
	configureLogger('none');
}
