export enum QueryOrder {
	ASC = 'ASC',
	DESC = 'DESC'
}

export enum QueryOrderNumeric {
	ASC = 1,
	DESC = -1
}

// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export declare type QueryOrderKeysFlat = QueryOrder | QueryOrderNumeric | keyof typeof QueryOrder;
export declare type QueryOrderKeys = QueryOrderKeysFlat | QueryOrderMap;

export interface QueryOrderMap {
	[x: string]: QueryOrderKeys;
}
