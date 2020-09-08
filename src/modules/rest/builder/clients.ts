import {CustomPathParameters} from '../definitions/types';
import {MethodMetadata} from '../definitions/method-metadata';
import {getMetadataStorage} from '../metadata';
import Mustache from 'mustache';
import fse from 'fs-extra';
import {ApiBinaryResult} from './express-responder';
import express from 'express';
import archiver from 'archiver';
import path from 'path';

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
	isLast?: boolean;
}

export function wrapLong(s: string): string {
	if (s && s.length > 140) {
		return s.split('&').map(s => s.trim()).join(' &\n\t');
	}
	return s;
}

export async function writeTemplate(name: string, template: string, data: unknown): Promise<{ name: string; content: string }> {
	return {
		name,
		content: Mustache.render((await fse.readFile(template)).toString(), data)
	};
}

export async function writeParts(name: string, template: string, serviceParts: Array<Part>): Promise<{ name: string; content: string }> {
	const list: Array<Part> = serviceParts
		.sort((a, b) => a.name.localeCompare(b.name));
	list.forEach((p, i) => {
		p.isLast = i === list.length - 1;
	});
	return writeTemplate(name, template, {list});
}

export function getResultType(call: MethodMetadata): string | undefined {
	const metadata = getMetadataStorage();
	let resultType: string | undefined;
	if (call.getReturnType) {
		const type = call.getReturnType();
		if (type === String) {
			resultType = 'string';
		} else if (type === Number) {
			resultType = 'string';
		} else if (type === Boolean) {
			resultType = 'boolean';
		} else {
			const enumInfo = metadata.enums.find(e => e.enumObj === type);
			if (enumInfo) {
				resultType = enumInfo.name;
			} else {
				const fObjectType = metadata.resultType(type);
				resultType = fObjectType?.name ? ('Jam.' + fObjectType?.name) : 'any';
			}
		}
		if (call.returnTypeOptions?.array) {
			resultType = 'Array<' + resultType + '>';
		}
	}
	return resultType;
}

export function getCallParamType(call: MethodMetadata): string {
	const metadata = getMetadataStorage();
	const types: Array<string> = [];
	if (call.params.filter(p => ['args', 'arg'].includes(p.kind)).length > 1) {
		types.push('JamParameters.' + call.controllerClassMetadata?.name.replace('Controller', '') + call.methodName[0].toUpperCase() + call.methodName.slice(1) + 'Args');
	} else {
		for (const param of call.params) {
			if (param.kind === 'arg' && param.mode !== 'file') {
				const type = param.getType();
				let typeString = '';
				const optional = param.typeOptions.nullable ? '?' : '';
				if (param.name === 'id') {
					typeString = param.typeOptions.nullable ? 'JamParameters.MaybeID' : 'JamParameters.ID';
				} else if (type === Boolean) {
					typeString = `{${param.name}${optional}: boolean}`;
				} else if (type === Number) {
					typeString = `{${param.name}${optional}: number}`;
				} else if (type === String) {
					typeString = `{${param.name}${optional}: string}`;
				} else {
					const enumInfo = metadata.enums.find(e => e.enumObj === type);
					if (enumInfo) {
						typeString = `{${param.name}${optional}: ${enumInfo.name}`;
					} else {
						const fObjectType = metadata.argumentTypes.find(it => it.target === type);
						typeString = fObjectType?.name ? ('JamParameter.' + fObjectType?.name) : 'any';
					}
				}
				if (param.typeOptions.array) {
					typeString = 'Array<' + typeString + '>';
				}
				types.push(typeString);
			} else if (param.kind === 'args') {
				const type = param.getType();
				const fObjectType = metadata.argumentTypes.find(it => it.target === type);
				let typeString = fObjectType?.name ? ('JamParameters.' + fObjectType?.name) : 'any';
				if (param.typeOptions.array) {
					typeString = 'Array<' + typeString + '>';
				}
				types.push(typeString);
			}
		}
	}
	return types.join(' & ');
}

export function callDescription(call: MethodMetadata): string | undefined {
	const roles = call.controllerClassMetadata?.roles || call.roles || [];
	const result = (call.description || '') + (roles && roles.length > 0 ? ` // Rights needed: ${roles.join(',')}` : '');
	return result.trim();
}

export function getCustomParameterTemplate(customPathParameters: CustomPathParameters, call: MethodMetadata, result: string): { validateCode: string; paramRoute: string } {
	const routeParts: Array<string> = [];
	const validateNames: Array<string> = [];
	customPathParameters.groups.forEach(g => {
		const hasOptionalAlias = !!(call.aliasRoutes || []).find(alias => alias.hideParameters.includes(g.name));
		if (hasOptionalAlias) {
			routeParts.push('${params.' + g.name + ' ? ' + '`' + (g.prefix || '') + '${params.' + g.name + '}` : \'\'}');
		} else {
			validateNames.push(g.name);
			routeParts.push((g.prefix || '') + '${params.' + g.name + '}');
		}
	});
	const validateCode = 'if (' + validateNames.map(s => '!params.' + s).join(' && ') + ') { ' + result + '; }';
	return {paramRoute: `/${routeParts.join('')}`, validateCode};
}

export async function getClientZip(filename: string, list: Array<{ name: string; content: string }>, models: Array<string>): Promise<ApiBinaryResult> {
	return {
		pipe: {
			pipe: (stream: express.Response): void => {
				// log.verbose('Start streaming');
				const archive = archiver('zip', {zlib: {level: 9}});
				archive.on('error', err => {
					// log.error('archiver err ' + err);
					throw err;
				});
				stream.contentType('zip');
				stream.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
				// stream.setHeader('Content-Length', stat.size); do NOT report wrong size!
				stream.on('finish', () => {
					// log.verbose('streamed ' + archive.pointer() + ' total bytes');
				});
				for (const entry of list) {
					archive.append(entry.content, {name: entry.name});
				}
				for (const entry of models) {
					archive.append(fse.createReadStream(path.resolve(`./static/models/${entry}`)), {name: `model/${entry}`});
				}
				archive.pipe(stream);
				archive.finalize().catch(e => {
					console.error(e);
				});
			}
		}
	};

}
