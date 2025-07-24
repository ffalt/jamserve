export enum QueryOrder {
	ASC = 'ASC',
	DESC = 'DESC'
}

export enum QueryOrderNumeric {
	ASC = 1,
	DESC = -1
}

export declare type QueryOrderKeysFlat = QueryOrder | QueryOrderNumeric | keyof typeof QueryOrder;
export declare type QueryOrderKeys = QueryOrderKeysFlat | QueryOrderMap;

export interface QueryOrderMap {
	[x: string]: QueryOrderKeys;
}

export interface FindOptions {
	populate?: Array<string> | boolean;
	orderBy?: QueryOrderMap;
	limit?: number;
	offset?: number;
	refresh?: boolean;
	fields?: Array<string>;
	schema?: string;
}
