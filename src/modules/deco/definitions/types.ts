import type { ValidatorOptions } from 'class-validator';
import { TypeResolver } from 'type-graphql';

export const bannedTypes: Array<Function> = [Promise, Array, Object, Function];

export type RecursiveArray<TValue> = Array<RecursiveArray<TValue> | TValue>;

export declare type TypeValue = Function | object | symbol;
export declare type TypeValueThunk = (type?: unknown) => TypeValue;
export declare type ReturnTypeFunctionValue = TypeValue | RecursiveArray<TypeValue> | undefined;
export declare type ReturnTypeFunction = (returns?: unknown) => ReturnTypeFunctionValue;

export interface DecoratorTypeOptions {
	nullable?: boolean | NullableListOptions;
	defaultValue?: any;
	generic?: boolean;
	isID?: boolean;
}

export declare type NullableListOptions = 'items' | 'itemsAndList';

export interface TypeOptions extends DecoratorTypeOptions {
	array?: boolean;
	arrayDepth?: number;
}

export interface DescriptionOptions {
	description?: string;
	summary?: string;
	tags?: Array<string>;
	example?: string | number | boolean | Date | Array<any>;
}

export interface RateLimitOptions {
	limit?: boolean;
}

export interface DeprecationOptions {
	deprecationReason?: string;
}

export interface ValidateOptions {
	validate?: boolean | ValidatorOptions;
}

export interface SchemaNameOptions {
	name?: string;
}

export interface AbstractClassOptions {
	isAbstract?: boolean;
}

export interface ImplementsClassOptions {
	implements?: Function | Array<Function>;
}

export interface AuthOptions {
	roles?: Array<string>;
}

export interface AbstractOptions {
	abstract?: boolean;
}

export interface ResolveTypeOptions<TSource = any, TContext = any> {
	resolveType?: TypeResolver<TSource, TContext>;
}

export interface EnumConfig {
	name: string;
	description?: string;
}

export interface NumberOptions {
	min?: number;
	max?: number;
}

export interface BinaryOptions {
	binary?: Array<string>;
	responseStringMimeTypes?: Array<string>;
}

export interface CustomPathParameterGroup extends NumberOptions {
	name: string;
	getType: TypeValueThunk;
	prefix?: string;
}

export interface CustomPathParameters {
	regex: RegExp;
	groups: Array<CustomPathParameterGroup>;
}

export interface CustomPathParameterAliasRouteOptions {
	route: string;
	name?: string;
	hideParameters?: Array<string>;
}

export interface CustomPathParameterOptions {
	customPathParameters?: CustomPathParameters;
	aliasRoutes?: Array<CustomPathParameterAliasRouteOptions>;
}

export declare type MethodAndPropertyDecorator = PropertyDecorator & MethodDecorator;
export declare type BasicOptions = DecoratorTypeOptions & DescriptionOptions;
export declare type AdvancedOptions = BasicOptions & DeprecationOptions & SchemaNameOptions;
export declare type MethodOptions = AdvancedOptions & DescriptionOptions & AuthOptions & BinaryOptions & CustomPathParameterOptions;
export declare type FieldOptions = AdvancedOptions & DescriptionOptions & AuthOptions & NumberOptions;
export declare type ControllerOptions = AdvancedOptions & DescriptionOptions & AuthOptions & AbstractOptions;
