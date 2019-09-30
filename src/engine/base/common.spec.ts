import nock from 'nock';
import {configureLogger} from '../../utils/logger';

nock.disableNetConnect();
// database, test api
nock.enableNetConnect(/(localhost|elastic\.co)/);

export function initTestFramework(): void {
	configureLogger('warn');
}

jest.setTimeout(30000);
