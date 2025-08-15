import 'reflect-metadata';
import nock from 'nock';
import { configureLogger } from '../src/utils/logger.js';

export function initTest(): void {
	nock.disableNetConnect();
	nock.enableNetConnect(/(localhost|0.0.0.0)/);
	configureLogger('none');
}
