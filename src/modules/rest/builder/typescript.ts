import {getMetadataStorage} from '../metadata/getMetadataStorage.js';
import {MethodMetadata} from '../../deco/definitions/method-metadata.js';
import {RestParamsMetadata} from '../../deco/definitions/param-metadata.js';
import {MetadataStorage} from '../../deco/definitions/metadata-storage.js';
import {FieldMetadata} from '../../deco/definitions/field-metadata.js';
import {ClassMetadata} from '../../deco/definitions/class-metadata.js';

const tab = '\t';
const tabtab = '\t\t';

export function buildTSEnums(): string {
	const metadata = getMetadataStorage();
	const sl: Array<string> = [
		'// @generated',
		'// This file was automatically generated and should not be edited.\n',
	];
	for (const enumInfo of metadata.enums) {
		const enumObj = enumInfo.enumObj as any;
		const entries: Array<string> = [];
		Object.keys(enumObj).forEach(key => {
			entries.push(`${tab + key} = '${enumObj[key]}'`);
		});
		sl.push('export enum ' + enumInfo.name + ' {\n' + entries.join(',\n') + '\n}\n');
	}
	return sl.join('\n');
}

function buildTSField(field: FieldMetadata, metadata: MetadataStorage, sl: Array<string>, withDefault: boolean = false) {
	const typeOptions = field.typeOptions;
	let fieldType: string;
	const jsDoc: Array<string> = [];
	if (field.description) {
		jsDoc.push(`${field.description}`);
	}
	const fType = field.getType();
	if (fType === String) {
		fieldType = 'string';
	} else if (fType === Number) {
		fieldType = 'number';
		jsDoc.push(`@TJS-type integer`);
		if (typeOptions.min !== undefined) {
			jsDoc.push(`@minimum ${typeOptions.min}`);
		}
		if (typeOptions.max !== undefined) {
			jsDoc.push(`@maximum ${typeOptions.max}`);
		}
	} else if (fType === Boolean) {
		fieldType = 'boolean';
		jsDoc.push(`@TJS-type boolean`);
	} else {
		const enumInfo = metadata.enums.find(e => e.enumObj === fType);
		if (enumInfo) {
			fieldType = 'JamEnums.' + enumInfo.name;
		} else {
			const fObjectType = metadata.resultTypes.find(t => t.target === fType);
			fieldType = fObjectType?.name || 'any';
		}
	}
	if (typeOptions.array) {
		fieldType = 'Array<' + fieldType + '>';
	}
	if (withDefault && typeOptions.defaultValue !== undefined) {
		jsDoc.push(`@default ${typeOptions.defaultValue}`);
	}
	if (jsDoc.length === 1) {
		sl.push(`${tabtab}/** ${jsDoc[0]} */`);
	} else if (jsDoc.length > 1) {
		sl.push(`${tabtab}/**\n${jsDoc.map(s => tabtab + ' * ' + s).join('\n')}\n${tabtab} */`);
	}
	sl.push(`${tabtab}${field.name}${typeOptions.nullable ? '?' : ''}: ${fieldType};`);
}

function buildTSType(type: ClassMetadata, metadata: MetadataStorage, sl: Array<string>, withDefault: boolean, list: Array<ClassMetadata>): void {
	let extension = '';
	const superClass = Object.getPrototypeOf(type.target);
	if (superClass.prototype !== undefined) {
		const superType = list.find(it => it.target === superClass);
		if (superType) {
			extension = ` extends ${superType.name}`;
		}
	}
	if (type.description) {
		sl.push(`${tab}/*\n${tab} * ${type.description}\n${tab} */`);
	}
	sl.push(`${tab}export interface ${type.name}${extension} {`);
	for (const field of type.fields) {
		buildTSField(field, metadata, sl, withDefault);
	}
	sl.push(`${tab}}\n`);
}

export function buildTSResultTypes(): string {
	const metadata = getMetadataStorage();
	const sl: Array<string> = [
		'// @generated',
		'// This file was automatically generated and should not be edited.\n',
		`import * as JamEnums from './jam-enums';\n`,
		'export declare namespace Jam {\n'
	];
	metadata.resultTypes
		.sort((a, b) => a.name.localeCompare(b.name))
		.forEach(type => buildTSType(type, metadata, sl, false, metadata.resultTypes));
	sl.push('}');
	return sl.join('\n') + '\n';
}

function getCombinedType(call: MethodMetadata) {
	if (call.params.filter(p => ['args', 'arg'].includes(p.kind)).length > 1) {
		const combineName = call.controllerClassMetadata?.name.replace('Controller', '') +
			call.methodName[0].toUpperCase() + call.methodName.slice(1) + 'Args';
		const names: Array<string> = [];
		call.params.forEach(p => {
			if (p.kind === 'args') {
				const type = (p as RestParamsMetadata).getType();
				const argumentType = getMetadataStorage().argumentTypes.find(it => it.target === type);
				if (argumentType) {
					names.push(argumentType.name);
				} else {
					names.push('ERROR: Could not find argument type for ' + p.methodName + ' ' + (p as RestParamsMetadata).propertyName);
				}
			} else if (p.kind === 'arg' && p.name === 'id') {
				names.push('ID');
			} else if (p.kind === 'arg' && p.mode === 'file') {
				// nope ignore
			} else if (p.kind !== 'context') {
				names.push('ERROR: TODO: support mixing kinds in combining parameters for ' + JSON.stringify(p));
			}
		});
		return [`${tab}export type ${combineName} = ${names.join(' & ')};\n`];
	}
	return [];
}

export function buildTSParameterTypes(): string {
	const metadata = getMetadataStorage();
	const sl: Array<string> = [
		'// @generated',
		'// This file was automatically generated and should not be edited.\n',
		`import * as JamEnums from './jam-enums';\n`,
		'export declare namespace JamParameters {\n'
	];
	metadata.argumentTypes
		.sort((a, b) => a.name.localeCompare(b.name))
		.forEach(type => buildTSType(type, metadata, sl, true, metadata.argumentTypes));
	sl.push(`${tab}export interface ID {\n${tabtab}id: string;\n${tab}}\n`);
	sl.push(`${tab}export interface MaybeID {\n${tabtab}id?: string;\n${tab}}\n`);
	for (const get of metadata.gets) {
		sl.push(...getCombinedType(get));
	}
	for (const post of metadata.posts) {
		sl.push(...getCombinedType(post));
	}
	return sl.join('\n') + '}\n';
}

