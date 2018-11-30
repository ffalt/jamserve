import {Engine} from '../src/engine/engine';
import {expect, should, use} from 'chai';
import {describe, it} from 'mocha';
import path from 'path';
import rimraf from 'rimraf';
import {configureLogger} from '../src/utils/logger';
import {BaseConfig, Config, extendConfig} from '../src/config';
import {shouldBehaveLikeAEngine} from './components/engine';

function testSuiteEngine(config: Config) {
	describe('engine', () => {
		before(function(done) {
			this.engine = new Engine(config);
			done();
		});
		shouldBehaveLikeAEngine();
	}).bail(true);
}

function mockupConfig(testPath: string): Config {
	const mockBaseConfig: BaseConfig = {
		log: {level: 'warn'},
		server: {
			listen: '0.0.0.0',
			port: 4041,
			session: {
				allowedCookieDomains: ['http://localhost:4041'],
				secret: '23409hj35bnkj34b5k345bhjk34534534',
				cookie: {
					name: 'jam-test.sid',
					secure: false,
					maxAge: {value: 5, unit: 'minute'}
				}
			},
			jwt: {
				secret: 'fksdjf4rk3j4b3k3bj45hv3j45hv3j4534534',
				maxAge: {value: 5, unit: 'minute'}
			}
		},
		paths: {
			data: testPath,
			jamberry: '../dist/jamberry'
		},
		database: {
			use: 'nedb',
			options: {
				elasticsearch: {
					host: 'localhost:9200',
					indexPrefix: 'jamtest',
					indexRefresh: 'true' // important for the tests! otherwise, async index changes are not immediately applied and therefor invisible in a following tests
				},
				nedb: {}
			}
		}
	};
	return extendConfig(<Config>mockBaseConfig);
}

function testSuiteNeDB() {
	describe('nedb', () => {
		const testPath = './test/data/nedb/';
		const config = mockupConfig(testPath);
		config.database.use = 'nedb';
		configureLogger(config.log.level);
		testSuiteEngine(config);
		before(function() {
			// runs before all tests in this block
			const datapath = path.resolve(testPath);
			rimraf.sync(datapath);
		});
		after(function() {
			// runs after all tests in this block
			const datapath = path.resolve(testPath);
			rimraf.sync(datapath);
		});
	});
}

function testSuiteElastic() {
	describe('elastic', () => {
		const testPath = './test/data/elastic/';
		const config = mockupConfig(testPath);
		config.database.use = 'elasticsearch';
		configureLogger(config.log.level);
		testSuiteEngine(config);
		after(function() {
			// runs after all tests in this block
			const datapath = path.resolve(testPath);
			rimraf.sync(datapath);
		});
	});
}

describe('jam', () => {
	testSuiteNeDB();
	testSuiteElastic();
});

