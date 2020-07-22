import {ClassType, TypeResolver} from 'type-graphql';
import {OrderByObj} from './query';

export const bannedTypes: Function[] = [Promise, Array, Object, Function];

export interface RecursiveArray<TValue> extends Array<RecursiveArray<TValue> | TValue> {
}

export declare type TypeValue = ClassType | Function | object | symbol;
export declare type TypeValueThunk = (type?: void) => TypeValue;
export declare type ReturnTypeFuncValue = TypeValue | RecursiveArray<TypeValue> | undefined;
export declare type ReturnTypeFunc = (returns?: void) => ReturnTypeFuncValue;

export interface DecoratorTypeOptions {
	nullable?: boolean;
}

export interface TypeOptions extends DecoratorTypeOptions {
	array?: boolean;
	arrayDepth?: number;
}

export interface SchemaNameOptions {
	name?: string;
}

export interface AbstractClassOptions {
	isAbstract?: boolean;
}

export interface AbstractOptions {
	abstract?: boolean;
}

export interface EnumConfig {
	name: string;
	description?: string;
}

export interface OrderByOptions {
	orderBy?: OrderByObj;
}

export interface OwnerOptions {
	owner?: boolean;
}

export declare type MappedByFunc<T> = (e: T) => any;

// (e: T) => any; // (string & keyof T) | ((e: T) => any);

export interface MappedByOptions<T> {
	mappedBy?: MappedByFunc<T>;
}

export interface PrimaryOptions {
	primaryKey: true; // always true
}

export interface RelationOptions {
	relation: 'one2many' | 'many2many' | 'many2one' | 'one2one';
}


export interface CascadeOptions {
	onDelete?: 'cascade';
}


export declare type MethodAndPropDecorator = PropertyDecorator & MethodDecorator;
export declare type BasicOptions = DecoratorTypeOptions;
export declare type AdvancedOptions = BasicOptions & SchemaNameOptions;
export declare type FieldOptions = AdvancedOptions;
export declare type PrimaryFieldOptions = FieldOptions & PrimaryOptions;

export declare type OneToManyFieldOptions<T> = FieldOptions & OrderByOptions & CascadeOptions;
export declare type ManyToManyFieldOptions<T> = FieldOptions & OrderByOptions & OwnerOptions;
export declare type ManyToOneFieldOptions<T> = FieldOptions;
export declare type OneToOneFieldOptions<T> = FieldOptions & OwnerOptions;

export declare type OneToManyFieldRelation<T> = OneToManyFieldOptions<T> & { relation: 'one2many' } & MappedByOptions<T>;
export declare type ManyToManyFieldRelation<T> = ManyToManyFieldOptions<T> & { relation: 'many2many' } & MappedByOptions<T>;
export declare type ManyToOneFieldRelation<T> = ManyToOneFieldOptions<T> & { relation: 'many2one' } & MappedByOptions<T>;
export declare type OneToOneFieldRelation<T> = OneToOneFieldOptions<T> & { relation: 'one2one' } & MappedByOptions<T>;

export declare type EntityTypeOptions = AbstractClassOptions & SchemaNameOptions;
