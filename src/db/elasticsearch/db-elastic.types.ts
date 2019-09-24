export type ElasticLogLevel = 'warning' | 'error' | 'trace';

export type ElasticIndexRefresh = 'true' | 'false' | 'wait_for';

interface ShardsResponse {
	total: number;
	successful: number;
	failed: number;
	skipped: number;
}

interface Explanation {
	value: number;
	description: string;
	details: Array<Explanation>;
}

export interface Hit<T> {
	_source: T;
}

export interface SearchResponse<T> {
	took: number;
	timed_out: boolean;
	_scroll_id?: string;
	_shards: ShardsResponse;
	hits: {
		total: number;
		max_score: number;
		hits: Array<{
			_index: string;
			_type: string;
			_id: string;
			_score: number;
			_source: T;
			_version?: number;
			_explanation?: Explanation;
			fields?: any;
			highlight?: any;
			inner_hits?: any;
			matched_queries?: Array<string>;
			sort?: Array<string>;
		}>;
	};
	aggregations?: any;
}

export interface DeleteByQueryResponse {
	deleted: number;
}

export interface GetResponse<T> {
	found: boolean;
	_source: T;
}

export interface MgetResponse<T> {
	docs: Array<{
		found: boolean;
		_source: T;
	}>;
}

export interface ElasticsearchConfig {
	host: string;
	indexPrefix: string;
	indexRefresh?: string;
	log?: Array<ElasticLogLevel>;
}
