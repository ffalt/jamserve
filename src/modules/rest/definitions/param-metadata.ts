import type {ValidatorOptions} from 'class-validator';
import {TypeOptions, TypeValueThunk} from './types.js';

export interface BasicParamMetadata {
	target: Function;
	methodName: string;
	index: number;
}

export interface InfoParamMetadata extends BasicParamMetadata {
	kind: 'info';
}

export interface PubSubParamMetadata extends BasicParamMetadata {
	kind: 'pubSub';
	triggerKey?: string;
}

export interface ContextParamMetadata extends BasicParamMetadata {
	kind: 'context';
	propertyName: string | undefined;
}

export interface RootParamMetadata extends BasicParamMetadata {
	kind: 'root';
	propertyName: string | undefined;
	getType: TypeValueThunk | undefined;
}

export interface CommonArgMetadata extends BasicParamMetadata {
	getType: TypeValueThunk;
	typeOptions: TypeOptions;
	validate: boolean | ValidatorOptions | undefined;
}

export interface RestParamMetadata extends CommonArgMetadata {
	kind: 'arg';
	name: string;
	description?: string;
	isID?: boolean;
	example?: any;
	deprecationReason?: string;
	mode: 'body' | 'query' | 'path' | 'file';
	propertyName: string | undefined;
}

export interface RestParamsMetadata extends CommonArgMetadata {
	kind: 'args';
	mode: 'body' | 'query' | 'path';
	propertyName: string | undefined;
}

// prettier-ignore
export type ParamMetadata =
	| InfoParamMetadata
	| PubSubParamMetadata
	| ContextParamMetadata
	| RootParamMetadata
	| RestParamMetadata
	| RestParamsMetadata
	;
