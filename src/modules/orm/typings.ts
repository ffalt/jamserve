import { Reference } from './helpers/reference.js';
import { Collection } from './helpers/collection.js';

export declare type Constructor<T> = new (...arguments: Array<any>) => T;

export declare const PrimaryKeyType: unique symbol;
export declare type Primary<T> = T extends { [PrimaryKeyType]: infer PK } ?
	PK :
	T extends { _id: infer PK } ?
		PK | string :
		T extends { uuid: infer PK } ?
			PK :
			T extends { id: infer PK } ?
				PK :
				never;

export declare type DeepPartialEntity<T> = {
	[P in keyof T]?: null | (T[P] extends Array<infer U> ? Array<DeepPartialEntity<U>> : T[P] extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartialEntity<U>> : T extends Date | RegExp ? T : DeepPartialEntity<T[P]> | PartialEntity<T[P]> | Primary<T[P]>);
};

export declare type IsScalar<T> = T extends number | string | bigint | Date | RegExp ? true : never;

export declare type EntityOrPrimary<T> = true extends IsScalar<T> ? never : DeepPartialEntity<ReferencedEntity<T>> | PartialEntity<ReferencedEntity<T>> | Primary<ReferencedEntity<T>> | ReferencedEntity<T>;
export declare type ReferencedEntity<T> = T extends Reference<infer K> ? K : T;
export declare type CollectionItem<T> = T extends Collection<infer K> ? EntityOrPrimary<K> : never;

export declare type IsEntity<T> = T extends {
	[PrimaryKeyType]: any;
} | {
	_id: any;
} | {
	uuid: string;
} | {
	id: number | string | bigint;
} ? true : never;
export declare type PartialEntityProperty<T, P extends keyof T> = null | (T extends Date | RegExp ? T : T[P] | (true extends IsEntity<T[P]> ? PartialEntity<T[P]> | Primary<T[P]> : never));
export declare type PartialEntity<T> = T extends Reference<infer U> ? {
	[P in keyof U]?: PartialEntityProperty<U, P>;
} : {
	[P in keyof T]?: PartialEntityProperty<T, P>;
};

export type Dictionary<T = any> = Record<string, T>;
export declare type AnyEntity<T = any, PK extends keyof T = keyof T> = {
	[K in PK]?: T[K];
} & {
	[PrimaryKeyType]?: T[PK];
};

export declare type IDEntity<T extends {} = any> = AnyEntity<T> & {
	id: string;
};

export declare type EntityClass<T extends AnyEntity<T>> = Function & {
	prototype: T;
};
export declare type EntityName<T extends AnyEntity<T>> = string | EntityClass<T>;
export declare type EntityData<T extends AnyEntity<T>> = {
	[K in keyof T]?: T[K] | Primary<T[K]> | Array<CollectionItem<T[K]>>;
} & Dictionary;
