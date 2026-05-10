import 'reflect-metadata';
import { configureLogger } from '../src/utils/logger.js';
import nock from 'nock';
import { afterEach } from '@jest/globals';

configureLogger('none');
nock.disableNetConnect();
nock.enableNetConnect(/(localhost|0.0.0.0)/);

afterEach(() => {
	nock.cleanAll();
	if (nock.isActive()) {
		nock.restore();
	}
	nock.disableNetConnect();
	nock.enableNetConnect(/(localhost|0.0.0.0)/);
});

