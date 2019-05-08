import {before} from 'mocha';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {configureLogger} from '../src/utils/logger';
import nock from 'nock';

nock.disableNetConnect();
nock.enableNetConnect('localhost:9200');

export function initTestFramework(): void {

	before(() => {
		chai.should();
		chai.use(chaiAsPromised);
	});

	configureLogger('warn');
}
