import {configureLogger} from '../../utils/logger';
import nock from 'nock';

nock.disableNetConnect();
nock.enableNetConnect('localhost:9200'); // database
nock.enableNetConnect('127.0.0.1:10010'); // test api

export function initTestFramework(): void {
	configureLogger('warn');
}
