import {ClassType} from 'type-graphql';

export const bannedTypes: Function[] = [Promise, Array, Object, Function];

export type RecursiveArray<TValue> = Array<RecursiveArray<TValue> | TValue>;

export declare type TypeValue = ClassType | Function | object | symbol;
export declare type TypeValueThunk = (type?: void) => TypeValue | string;
export declare type ReturnTypeFuncValue = TypeValue | RecursiveArray<TypeValue> | string | undefined;
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
	order?: Array<{ orderBy: string; orderDesc?: boolean }>;
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

export declare type OneToManyFieldOptions = FieldOptions & OrderByOptions & CascadeOptions;
export declare type ManyToManyFieldOptions = FieldOptions & OrderByOptions & OwnerOptions;
export declare type ManyToOneFieldOptions = FieldOptions;
export declare type OneToOneFieldOptions = FieldOptions & OwnerOptions;

export declare type OneToManyFieldRelation<T> = OneToManyFieldOptions & { relation: 'one2many' } & MappedByOptions<T>;
export declare type ManyToManyFieldRelation<T> = ManyToManyFieldOptions & { relation: 'many2many' } & MappedByOptions<T>;
export declare type ManyToOneFieldRelation<T> = ManyToOneFieldOptions & { relation: 'many2one' } & MappedByOptions<T>;
export declare type OneToOneFieldRelation<T> = OneToOneFieldOptions & { relation: 'one2one' } & MappedByOptions<T>;

export declare type EntityTypeOptions = AbstractClassOptions & SchemaNameOptions;
