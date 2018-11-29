export type ElasticLogLevel = 'warning' | 'error' | 'trace';

export interface ElasticsearchConfig {
	host: string;
	indexPrefix: string;
	indexRefresh?: string;
	log?: Array<ElasticLogLevel>;
}
