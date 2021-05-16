"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildTSParameterTypes = exports.buildTSResultTypes = exports.buildTSEnums = void 0;
const metadata_1 = require("../metadata");
const tab = '\t';
const tabtab = '\t\t';
function buildTSEnums() {
    const metadata = metadata_1.getMetadataStorage();
    const sl = [
        '// @generated',
        '// This file was automatically generated and should not be edited.\n',
    ];
    for (const enumInfo of metadata.enums) {
        const enumObj = enumInfo.enumObj;
        const entries = [];
        Object.keys(enumObj).forEach(key => {
            entries.push(`${tab + key} = '${enumObj[key]}'`);
        });
        sl.push('export enum ' + enumInfo.name + ' {\n' + entries.join(',\n') + '\n}\n');
    }
    return sl.join('\n');
}
exports.buildTSEnums = buildTSEnums;
function buildTSField(field, metadata, sl, withDefault = false) {
    const typeOptions = field.typeOptions;
    let fieldType;
    const jsDoc = [];
    if (field.description) {
        jsDoc.push(`${field.description}`);
    }
    const fType = field.getType();
    if (fType === String) {
        fieldType = 'string';
    }
    else if (fType === Number) {
        fieldType = 'number';
        jsDoc.push(`@TJS-type integer`);
        if (typeOptions.min !== undefined) {
            jsDoc.push(`@minimum ${typeOptions.min}`);
        }
        if (typeOptions.max !== undefined) {
            jsDoc.push(`@maximum ${typeOptions.max}`);
        }
    }
    else if (fType === Boolean) {
        fieldType = 'boolean';
        jsDoc.push(`@TJS-type boolean`);
    }
    else {
        const enumInfo = metadata.enums.find(e => e.enumObj === fType);
        if (enumInfo) {
            fieldType = 'JamEnums.' + enumInfo.name;
        }
        else {
            const fObjectType = metadata.resultType(fType);
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
    }
    else if (jsDoc.length > 1) {
        sl.push(`${tabtab}/**\n${jsDoc.map(s => tabtab + ' * ' + s).join('\n')}\n${tabtab} */`);
    }
    sl.push(`${tabtab}${field.name}${typeOptions.nullable ? '?' : ''}: ${fieldType};`);
}
function buildTSType(type, metadata, sl, withDefault, list) {
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
function buildTSResultTypes() {
    const metadata = metadata_1.getMetadataStorage();
    const sl = [
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
exports.buildTSResultTypes = buildTSResultTypes;
function getCombinedType(call) {
    if (call.params.filter(p => ['args', 'arg'].includes(p.kind)).length > 1) {
        const combineName = call.controllerClassMetadata?.name.replace('Controller', '') +
            call.methodName[0].toUpperCase() + call.methodName.slice(1) + 'Args';
        const names = [];
        call.params.forEach(p => {
            if (p.kind === 'args') {
                const type = p.getType();
                const argumentType = metadata_1.getMetadataStorage().argumentTypes.find(it => it.target === type);
                if (argumentType) {
                    names.push(argumentType.name);
                }
                else {
                    names.push('ERROR: Could not find argument type for ' + p.methodName + ' ' + p.propertyName);
                }
            }
            else if (p.kind === 'arg' && p.name === 'id') {
                names.push('ID');
            }
            else if (p.kind === 'arg' && p.mode === 'file') {
            }
            else if (p.kind !== 'context') {
                names.push('ERROR: TODO: support mixing kinds in combining parameters for ' + JSON.stringify(p));
            }
        });
        return [`${tab}export type ${combineName} = ${names.join(' & ')};\n`];
    }
    return [];
}
function buildTSParameterTypes() {
    const metadata = metadata_1.getMetadataStorage();
    const sl = [
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
exports.buildTSParameterTypes = buildTSParameterTypes;
//# sourceMappingURL=typescript.js.map