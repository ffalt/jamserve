import {Dictionary, IPrimaryKey} from '../typings.js';

export enum QueryOrder {
	ASC = 'ASC',
	DESC = 'DESC',
	asc = 'asc',
	desc = 'desc'
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

export interface FlatQueryOrderMap {
	[x: string]: QueryOrderKeysFlat;
}

export interface OrderByObj {
	[name: string]: QueryOrder | OrderByObj;
}

export interface FindOptions {
	populate?: string[] | boolean;
	orderBy?: QueryOrderMap;
	limit?: number;
	offset?: number;
	refresh?: boolean;
	fields?: string[];
	schema?: string;
}

export interface FindOneOptions {
	populate?: string[] | boolean;
	orderBy?: QueryOrderMap;
	refresh?: boolean;
	fields?: string[];
	schema?: string;
}

export interface FindOneOrFailOptions extends FindOneOptions {
	failHandler?: (entityName: string, where: Dictionary | IPrimaryKey | any) => Error;
}
