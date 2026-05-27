import 'reflect-metadata';
import { configureLogger } from '../src/utils/logger.js';
import nock from 'nock';
import { afterAll, beforeEach, afterEach } from '@jest/globals';

configureLogger('none');

beforeEach(() => {
	if (!nock.isActive()) {
		nock.activate();
	}
	nock.disableNetConnect();
	nock.enableNetConnect(/(localhost|0.0.0.0)/);
});

afterEach(() => {
	nock.cleanAll();
	nock.disableNetConnect();
	nock.enableNetConnect(/(localhost|0.0.0.0)/);
});

afterAll(() => {
	nock.cleanAll();
	if (nock.isActive()) {
		nock.restore();
	}
});
