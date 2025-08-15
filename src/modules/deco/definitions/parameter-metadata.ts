import type { ValidatorOptions } from 'class-validator';
import { TypeOptions, TypeValueThunk } from './types.js';

export interface BasicParameterMetadata {
	target: Function;
	methodName: string;
	index: number;
}

export interface InfoParameterMetadata extends BasicParameterMetadata {
	kind: 'info';
}

export interface PubSubParameterMetadata extends BasicParameterMetadata {
	kind: 'pubSub';
	triggerKey?: string;
}

export interface ContextParameterMetadata extends BasicParameterMetadata {
	kind: 'context';
	propertyName: string | undefined;
}

export interface RootParameterMetadata extends BasicParameterMetadata {
	kind: 'root';
	propertyName: string | undefined;
	getType: TypeValueThunk | undefined;
}

export interface CommonParameterMetadata extends BasicParameterMetadata {
	getType: TypeValueThunk;
	typeOptions: TypeOptions;
	validate: boolean | ValidatorOptions | undefined;
}

export interface RestParameterMetadata extends CommonParameterMetadata {
	kind: 'arg';
	name: string;
	description?: string;
	isID?: boolean;
	example?: any;
	deprecationReason?: string;
	mode: 'body' | 'query' | 'path' | 'file';
	propertyName: string | undefined;
}

export interface RestParametersMetadata extends CommonParameterMetadata {
	kind: 'args';
	mode: 'body' | 'query' | 'path';
	propertyName: string | undefined;
}

export type ParameterMetadata = InfoParameterMetadata | PubSubParameterMetadata | ContextParameterMetadata | RootParameterMetadata | RestParameterMetadata | RestParametersMetadata;
