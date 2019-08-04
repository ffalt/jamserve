/***
 * based on https://github.com/analog-nico/es-sequence
 * MIT
 */

import elasticsearch from 'elasticsearch';

const esTypeMapping = {
	_source: {enabled: false},
	_all: {enabled: false},
	// _type: {index: 'no'},
	enabled: false
};

export class DbElasticSequence {
	client: elasticsearch.Client;
	private initPromise: Promise<any> | null = null;
	private initError: Promise<any> | null = null;
	private cacheFillPromise: Promise<any> | null = null;
	private cache: { [sequenceName: string]: Array<string> } = {};
	private cacheSize = 100;
	private options = {esIndex: 'sequences', esType: 'sequence'};

	constructor(client: elasticsearch.Client) {
		this.client = client;
		if (!isInjectedClientValid(client)) {
			throw new Error('Init was called with an invalid client parameter value.');
		}
	}

	async init(options?: any, cacheSize?: number): Promise<any> {
		// The following checks are done before the init promise is created
		// because errors thrown in the init promise are stored in _initError.
		// If a check fails it should look as if init was not called.
		if (!isInjectedClientValid(this.client)) {
			return Promise.reject(new Error('Init was called with an invalid client parameter value.'));
		}
		if (this.initPromise !== null) {
			return Promise.reject(new Error('Init was called while a previous init is pending.'));
		}
		if (this.cacheFillPromise !== null) {
			return Promise.reject(new Error('Init was called while get requests are pending.'));
		}
		if (!isInjectedCacheSizeValid(cacheSize)) {
			return Promise.reject(new Error('Init was called with an invalid cacheSize parameter value.'));
		}
		this.initPromise = new Promise((resolve) => {
			this.cache = {}; // In case init is called multiple times.
			this.cacheSize = 100;
			this.initError = null;
			if (cacheSize !== undefined) {
				this.cacheSize = cacheSize;
			}
			if (isObject(options)) {
				this.options = {...this.options, ...options};
			}
			resolve(this.initEsIndexIfNeeded());
		}).catch((e) => {
			this.initError = e;
			throw e;
		}).then(() => {
			this.initPromise = null;
		});
		return this.initPromise;
	}

	async addMappingToEsIndexIfMissing(): Promise<any> {
		const mapping: any = {};
		mapping[this.options.esType] = esTypeMapping;
		return this.client.indices.putMapping({
			index: this.options.esIndex,
			type: this.options.esType,
			// ignore_conflicts: true,
			body: mapping
		});
	}

	async initEsIndexIfNeeded(): Promise<any> {
		const response = await this.client.indices.exists({index: this.options.esIndex});
		if (response) {
			return this.addMappingToEsIndexIfMissing();
		}
		const config: any = {
			settings: {
				number_of_shards: 1,
				auto_expand_replicas: '0-all'
			},
			mappings: {}
		};
		config.mappings[this.options.esType] = esTypeMapping;
		return this.client.indices.create({
			index: this.options.esIndex,
			body: config
		});
	}

	private async fillCache(sequenceName: string): Promise<any> {
		this.cacheFillPromise = new Promise(resolve => {
			if (!this.cache[sequenceName]) {
				this.cache[sequenceName] = [];
			}
			const bulkParams: elasticsearch.BulkIndexDocumentsParams = {body: []};
			for (let i = 0; i < this.cacheSize; i += 1) {
				// Action
				bulkParams.body.push({index: {_index: this.options.esIndex, _type: this.options.esType, _id: sequenceName}});
				// Empty document
				bulkParams.body.push({});
			}
			resolve(
				this.client.bulk(bulkParams).then(response => {
					for (const item of response.items) {
						// This is the core trick: The document's version is an auto-incrementing integer.
						this.cache[sequenceName].push(item.index._version);
					}
				})
			);
		}).then(() => {
			this.cacheFillPromise = null;
		});
		return this.cacheFillPromise;
	}

	private async interal_get(sequenceName: string): Promise<any> {
		if (this.initError !== null) {
			return Promise.reject(this.initError);
		}
		if (this.cache[sequenceName] && this.cache[sequenceName].length > 0) {
			return Promise.resolve(this.cache[sequenceName].shift());
		}

		const returnValue = async (): Promise<any> => {
			return this.interal_get(sequenceName);
		};

		if (this.cacheFillPromise !== null) {
			return this.cacheFillPromise.then(returnValue);
		}
		return this.fillCache(sequenceName).then(returnValue);
	}

	public async get(sequenceName: string): Promise<any> {
		if (!this.client) {
			throw new Error('Please run init(...) first to provide an elasticsearch client.');
		}
		if ((!sequenceName) || sequenceName.length === 0) {
			throw new Error('The parameter value for sequenceName is invalid.');
		}
		if (this.initPromise !== null) {
			// Defer until init is done
			return this.initPromise.then(() => this.interal_get(sequenceName));
		}
		return this.interal_get(sequenceName);
	}

	public getCacheSize(sequenceName: string): number {
		if (!this.cache[sequenceName]) {
			return 0;
		}
		return this.cache[sequenceName].length;
	}

}

function isObject(val: any): boolean {
	return typeof val === 'object';
}

function isFunction(val: any): boolean {
	return typeof val === 'function';
}

function isInjectedClientValid(client: elasticsearch.Client): boolean {
	return !((!isObject(client) && !isFunction(client)) ||
		(!isObject(client.indices) && !isFunction(client.indices)) ||
		!isFunction(client.indices.create) ||
		!isFunction(client.indices.exists) ||
		!isFunction(client.indices.putMapping) ||
		!isFunction(client.bulk));
}

function isInjectedCacheSizeValid(cacheSize: number | any): boolean {
	return ((cacheSize === undefined) || (typeof cacheSize === 'number' && isFinite(cacheSize) && Math.floor(cacheSize) === cacheSize));
}
