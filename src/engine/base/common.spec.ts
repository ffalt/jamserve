import nock from 'nock';
import {configureLogger} from '../../utils/logger';

nock.disableNetConnect();
nock.enableNetConnect('localhost'); // database, test api
export function initTestFramework(): void {
	configureLogger('warn');
}
