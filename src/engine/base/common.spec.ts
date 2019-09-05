import {configureLogger} from '../../utils/logger';
import nock from 'nock';

nock.disableNetConnect();
nock.enableNetConnect('localhost:9200');

export function initTestFramework(): void {
	configureLogger('warn');
}
