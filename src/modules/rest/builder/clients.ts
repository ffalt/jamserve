import { CustomPathParameters } from '../../deco/definitions/types.js';
import { MethodMetadata } from '../../deco/definitions/method-metadata.js';
import { metadataStorage } from '../metadata/metadata-storage.js';
import Mustache from 'mustache';
import fse from 'fs-extra';
import { ApiBinaryResult } from '../../deco/express/express-responder.js';
import express from 'express';
import archiver from 'archiver';
import path from 'node:path';
import { RestParameterMetadata, RestParametersMetadata } from '../../deco/definitions/parameter-metadata.js';
import { MetadataStorage } from '../../deco/definitions/metadata-storage.js';
import { capitalize } from '../../../utils/capitalize.js';

export interface MustacheDataClientCallFunction {
	name: string;
	paramName: string;
	paramsType: string;
	resultType: string;
	baseFunc: string;
	baseFuncResultType: string;
	baseFuncParameters: string;
	tick: string;
	apiPath: string;
	validate?: string;
	description?: string;
	apiPathTemplate?: boolean;
	sync?: boolean;
}

export interface Part {
	name: string;
	part: string;
	content: string;
	isLast?: boolean;
}

export type MustacheDataClientCallSections = Record<string, Array<MustacheDataClientCallFunction>>;

export type GenerateRequestClientCallsFunction = (call: MethodMetadata, name: string, parameterType: string, method: 'post' | 'get') => Array<MustacheDataClientCallFunction>;
export type GenerateBinaryClientCallsFunction = (call: MethodMetadata, name: string, parameterType: string) => Array<MustacheDataClientCallFunction>;
export type GenerateUploadClientCallsFunction = (call: MethodMetadata, name: string, parameterType: string, upload: RestParameterMetadata) => Array<MustacheDataClientCallFunction>;

function generateClientCalls(
	call: MethodMetadata, method: 'post' | 'get',
	generateRequestClientCalls: GenerateRequestClientCallsFunction,
	generateBinaryClientCalls: GenerateBinaryClientCallsFunction,
	generateUploadClientCalls: GenerateUploadClientCallsFunction
): Array<MustacheDataClientCallFunction> {
	const name = call.methodName.replaceAll('/', '_');
	const upload = call.parameters.find(o => o.kind === 'arg' && o.mode === 'file');
	const parameterType = getCallParameterType(call);
	if (upload) {
		return generateUploadClientCalls(call, name, parameterType, upload as RestParameterMetadata);
	}
	if (call.binary) {
		return generateBinaryClientCalls(call, name, parameterType);
	}
	return generateRequestClientCalls(call, name, parameterType, method);
}

export async function buildServiceParts(
	generateRequestClientCalls: GenerateRequestClientCallsFunction,
	generateBinaryClientCalls: GenerateBinaryClientCallsFunction,
	generateUploadClientCalls: GenerateUploadClientCallsFunction,
	buildPartService: (key: string, part: string, methods: Array<MustacheDataClientCallFunction>) => Promise<string>
): Promise<Array<Part>> {
	const metadata = metadataStorage();
	const sections: MustacheDataClientCallSections = {};
	buildCallSections(metadata.gets, 'get', sections, (call, method) =>
		generateClientCalls(call, method, generateRequestClientCalls, generateBinaryClientCalls, generateUploadClientCalls));
	buildCallSections(metadata.posts, 'post', sections, (call, method) =>
		generateClientCalls(call, method, generateRequestClientCalls, generateBinaryClientCalls, generateUploadClientCalls));
	const keys = Object.keys(sections).filter(key => !['Auth', 'Base'].includes(key));
	const parts: Array<Part> = [];
	for (const key of keys) {
		const part = capitalize(key);
		parts.push({ name: key.toLowerCase(), part, content: await buildPartService(key, part, sections[key]) });
	}
	return parts;
}

export async function buildPartService(template: string, key: string, part: string, calls: Array<MustacheDataClientCallFunction>): Promise<string> {
	const list = calls.map(call => {
		return { ...call, name: call.name.replace(`${key}_`, ''), paramsType: wrapLong(call.paramsType) };
	});
	const withHttpEvent = calls.some(c => c.resultType.includes('HttpEvent'));
	const withJam = calls.some(c => c.resultType.includes('Jam.'));
	const withJamParameter = calls.some(c => c.paramsType.includes('JamParameter'));
	return buildTemplate(template, { list, part, withHttpEvent, withJam, withJamParam: withJamParameter });
}

export function buildCallSections(
	calls: Array<MethodMetadata>,
	method: 'post' | 'get',
	sections: MustacheDataClientCallSections,
	generateClientCalls: (call: MethodMetadata, method: 'post' | 'get') => Array<MustacheDataClientCallFunction>
): void {
	for (const call of calls) {
		if (call.controllerClassMetadata) {
			const tag = call.controllerClassMetadata.name.replace('Controller', '');
			sections[tag] = [...(sections[tag] ?? []), ...generateClientCalls(call, method)];
		}
	}
}

export function wrapLong(s: string): string {
	if (s && s.length > 140) {
		return s.split('&').map(s => s.trim()).join(' &\n\t');
	}
	return s;
}

export async function buildTemplate(template: string, data: unknown = {}): Promise<string> {
	const file = await fse.readFile(template);
	return Mustache.render(file.toString(), data);
}

export async function buildParts(template: string, serviceParts: Array<Part>): Promise<string> {
	const list: Array<Part> = serviceParts
		.sort((a, b) => a.name.localeCompare(b.name));
	for (const [index, entry] of list.entries()) {
		entry.isLast = index === list.length - 1;
	}
	return buildTemplate(template, { list });
}

export function getResultType(call: MethodMetadata): string | undefined {
	const metadata = metadataStorage();
	let resultType: string | undefined;
	if (call.getReturnType) {
		const type = call.getReturnType();
		switch (type) {
			case String: {
				resultType = 'string';
				break;
			}
			case Number: {
				resultType = 'string';
				break;
			}
			case Boolean: {
				resultType = 'boolean';
				break;
			}
			default: {
				const enumInfo = metadata.enumInfo(type);
				if (enumInfo) {
					resultType = enumInfo.name;
				} else {
					const fObjectType = metadata.resultType(type);
					resultType = fObjectType?.name ? (`Jam.${fObjectType.name}`) : 'any';
				}
			}
		}
		if (call.returnTypeOptions?.array) {
			resultType = `Array<${resultType}>`;
		}
	}
	return resultType;
}

function getCallParameterArgumentType(parameter: RestParameterMetadata, metadata: MetadataStorage) {
	const type = parameter.getType();
	let typeString: string;
	const optional = parameter.typeOptions.nullable ? '?' : '';
	if (parameter.name === 'id') {
		typeString = parameter.typeOptions.nullable ? 'JamParameters.MaybeID' : 'JamParameters.ID';
	} else {
		switch (type) {
			case Boolean: {
				typeString = `{${parameter.name}${optional}: boolean}`;
				break;
			}
			case Number: {
				typeString = `{${parameter.name}${optional}: number}`;
				break;
			}
			case String: {
				typeString = `{${parameter.name}${optional}: string}`;
				break;
			}
			default: {
				const enumInfo = metadata.enumInfo(type);
				if (enumInfo) {
					typeString = `{${parameter.name}${optional}: ${enumInfo.name}`;
				} else {
					const fObjectType = metadata.parameterTypes.find(it => it.target === type);
					typeString = fObjectType?.name ? (`JamParameter.${fObjectType.name}`) : 'any';
				}
			}
		}
	}
	if (parameter.typeOptions.array) {
		typeString = `Array<${typeString}>`;
	}
	return typeString;
}

function getCallParameterArgumentsType(parameter: RestParametersMetadata, metadata: MetadataStorage) {
	const type = parameter.getType();
	const fObjectType = metadata.parameterTypes.find(it => it.target === type);
	let typeString = fObjectType?.name ? `JamParameters.${fObjectType.name}` : 'any';
	if (parameter.typeOptions.array) {
		typeString = `Array<${typeString}>`;
	}
	return typeString;
}

export function getCallParameterType(call: MethodMetadata): string {
	const metadata = metadataStorage();
	const types: Array<string> = [];
	if (call.parameters.filter(p => ['args', 'arg'].includes(p.kind)).length > 1) {
		types.push(`JamParameters.${call.controllerClassMetadata?.name.replace('Controller', '')}${capitalize(call.methodName)}Parameters`);
	} else {
		for (const parameter of call.parameters) {
			if (parameter.kind === 'arg' && parameter.mode !== 'file') {
				types.push(getCallParameterArgumentType(parameter, metadata));
			} else if (parameter.kind === 'args') {
				types.push(getCallParameterArgumentsType(parameter, metadata));
			}
		}
	}
	return types.join(' & ');
}

export function callDescription(call: MethodMetadata): string | undefined {
	const roles = call.controllerClassMetadata?.roles ?? call.roles ?? [];
	const result = (call.description ?? '') + (roles.length > 0 ? ` // Rights needed: ${roles.join(',')}` : '');
	return result.trim();
}

export function getCustomParameterTemplate(customPathParameters: CustomPathParameters, call: MethodMetadata, result: string): { validateCode: string; paramRoute: string } {
	const routeParts: Array<string> = [];
	const validateNames: Array<string> = [];
	for (const g of customPathParameters.groups) {
		const hasOptionalAlias = (call.aliasRoutes ?? []).some(alias => (alias.hideParameters ?? []).includes(g.name));
		if (hasOptionalAlias) {
			routeParts.push(`$\{params.${g.name} ? \`${g.prefix ?? ''}$\{params.${g.name}}\` : ''}`);
		} else {
			validateNames.push(g.name);
			routeParts.push(`${g.prefix ?? ''}$\{params.${g.name}}`);
		}
	}
	const condition = validateNames.map(s => `!params.${s}`).join(' && ');
	const validateCode = `if (${condition}) {\n\t\t\t${result};\n\t\t}`;
	return { paramRoute: `/${routeParts.join('')}`, validateCode };
}

export async function getClientZip(filename: string, list: Array<{ name: string; content: string }>, models: Array<string>): Promise<ApiBinaryResult> {
	return {
		pipe: {
			pipe: (res: express.Response): void => {
				const archive = archiver('zip', { zlib: { level: 9 } });
				archive.on('error', error => {
					throw error;
				});
				res.contentType('zip');
				res.type('application/zip');
				res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
				for (const entry of list) {
					archive.append(entry.content, { name: entry.name });
				}
				for (const entry of models) {
					archive.append(fse.createReadStream(path.resolve(`./static/models/${entry}`)), { name: `model/${entry}` });
				}
				archive.pipe(res);
				archive.finalize()
					.catch((error: unknown) => {
						console.error(error);
					});
			}
		}
	};
}
