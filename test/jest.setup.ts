import 'reflect-metadata';
import { configureLogger } from '../src/utils/logger.js';
import nock from 'nock';

configureLogger('none');
nock.disableNetConnect();
nock.enableNetConnect(/(localhost|0.0.0.0)/);
