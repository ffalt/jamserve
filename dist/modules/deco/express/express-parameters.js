import { getEnumReverseValuesMap } from '../helpers/enums.js';
import { GenericError, InvalidParamError, MissingParamError } from './express-error.js';
import { getDefaultValue } from '../helpers/default-value.js';
import { iterateArguments } from '../helpers/iterate-super.js';
export class ExpressParameters {
    static validateBoolean(value, typeOptions, param) {
        if (typeOptions.array) {
            throw InvalidParamError(param.name);
        }
        if (typeof value !== 'boolean') {
            if (value === 'true') {
                return true;
            }
            else if (value === 'false') {
                return false;
            }
            else {
                throw InvalidParamError(param.name);
            }
        }
        return value;
    }
    static validateNumberPart(value, typeOptions, param) {
        if (value === '') {
            throw InvalidParamError(param.name, `Parameter value is not a number`);
        }
        const val = Number(value);
        if (isNaN(val)) {
            throw InvalidParamError(param.name, `Parameter value is not a number`);
        }
        if (val % 1 !== 0) {
            throw InvalidParamError(param.name, `Parameter value is not an integer`);
        }
        if (typeOptions.min !== undefined && val < typeOptions.min) {
            throw InvalidParamError(param.name, `Parameter value too small`);
        }
        if (typeOptions.max !== undefined && val > typeOptions.max) {
            throw InvalidParamError(param.name, `Parameter value too high`);
        }
        return val;
    }
    static validateNumber(value, typeOptions, param) {
        if (typeOptions.array) {
            const array = Array.isArray(value) ? value : [value];
            return array.map(v => ExpressParameters.validateNumberPart(v, typeOptions, param));
        }
        return ExpressParameters.validateNumberPart(value, typeOptions, param);
    }
    validateString(value, typeOptions, param) {
        if (typeOptions.array) {
            let array = [];
            if (value && Array.isArray(value)) {
                array = value;
            }
            else if (value) {
                const s = `${value}`;
                if (s.length === 0) {
                    throw InvalidParamError(param.name);
                }
                array = [s];
            }
            return array.map((v) => String(v)).filter((v) => {
                if (v.length === 0 && !typeOptions.nullable) {
                    throw InvalidParamError(param.name);
                }
                return v.length > 0;
            });
        }
        else {
            const val = String(value);
            if (val.length === 0) {
                if (typeOptions.nullable) {
                    return;
                }
                throw InvalidParamError(param.name);
            }
            return val;
        }
    }
    validateEnum(value, typeOptions, param, enumInfo) {
        const enumObj = enumInfo.enumObj;
        const enumValues = getEnumReverseValuesMap(enumObj);
        if (typeOptions.array) {
            let array = Array.isArray(value) ? value : [value];
            array = (array || []).map((v) => String(v)).filter(s => s.length > 0);
            for (const val of array) {
                if (!enumValues[val]) {
                    throw InvalidParamError(param.name, `Enum value not valid`);
                }
            }
            return array;
        }
        else {
            const val = String(value);
            if (!enumValues[val]) {
                throw InvalidParamError(param.name, `Enum value not valid`);
            }
            return val;
        }
    }
    validateObjOrFail(value, typeOptions, param, type, metadata) {
        if (typeof value !== 'object') {
            throw new Error(`Internal: Invalid Parameter Object Type for field '${param.name}'`);
        }
        const argumentType = metadata.argumentTypes.find(it => it.target === type);
        if (argumentType) {
            const result = new argumentType.target();
            for (const field of argumentType.fields) {
                result[field.name] = this.validateParameter(field, value, true, metadata);
            }
            return result;
        }
        if (param.typeOptions.generic) {
            return value;
        }
        throw new Error(`Internal: Unknown Parameter Type, did you forget to register an enum? '${param.name}'`);
    }
    validateParameter(param, data, isField, metadata) {
        if (isField) {
            const argumentInstance = new param.target();
            param.typeOptions.defaultValue = getDefaultValue(argumentInstance, param.typeOptions, param.name);
        }
        let value = data[param.name];
        if (value === undefined) {
            value = param.typeOptions.defaultValue;
        }
        const typeOptions = param.typeOptions;
        const isNull = (value === undefined || value === null);
        if (!typeOptions.nullable && isNull) {
            throw MissingParamError(param.name);
        }
        if (isNull) {
            return;
        }
        const type = param.getType();
        if (type === Boolean) {
            value = ExpressParameters.validateBoolean(value, typeOptions, param);
        }
        else if (type === Number) {
            value = ExpressParameters.validateNumber(value, typeOptions, param);
        }
        else if (type === String) {
            value = this.validateString(value, typeOptions, param);
        }
        else {
            const enumInfo = metadata.enums.find(e => e.enumObj === type);
            if (enumInfo) {
                value = this.validateEnum(value, typeOptions, param, enumInfo);
            }
            else {
                value = this.validateObjOrFail(value, typeOptions, param, type, metadata);
            }
        }
        return value;
    }
    static getData(mode, context) {
        switch (mode) {
            case 'body':
                return context.req.body;
            case 'query':
                return context.req.query;
            case 'path':
                return context.req.params;
            case 'file': {
                if (!context.req.file) {
                    return {};
                }
                const upload = {
                    name: context.req.file.path,
                    size: context.req.file.size,
                    originalname: context.req.file.originalname,
                    type: context.req.file.mimetype
                };
                return upload;
            }
        }
        return {};
    }
    prepareParameterSingle(param, context, metadata) {
        const result = ExpressParameters.getData(param.mode, context);
        if (param.mode === 'file') {
            if (!result) {
                throw MissingParamError(param.name);
            }
            return result;
        }
        return this.validateParameter(param, result, false, metadata);
    }
    mapArgFields(argumentType, data, args = {}, metadata) {
        argumentType.fields.forEach(field => {
            args[field.name] = this.validateParameter(field, data, true, metadata);
        });
    }
    prepareParameterObj(param, context, metadata) {
        const type = param.getType();
        const argumentType = metadata.argumentTypes.find(it => it.target === type);
        if (!argumentType) {
            throw GenericError(`The value used as a type of '@QueryParams' for '${param.propertyName}' of '${param.target.name}.${param.methodName}' ` +
                `is not a class decorated with '@ObjParamsType' decorator!`);
        }
        const args = {};
        const data = ExpressParameters.getData(param.mode, context);
        iterateArguments(metadata.argumentTypes, argumentType, argument => {
            this.mapArgFields(argument, data, args, metadata);
        });
        return args;
    }
    validateArgument(param, context, metadata) {
        switch (param.kind) {
            case 'context':
                return param.propertyName ? context[param.propertyName] : context;
            case 'arg': {
                return this.prepareParameterSingle(param, context, metadata);
            }
            case 'args':
                return this.prepareParameterObj(param, context, metadata);
        }
        throw GenericError(`Internal: not implemented ${param.methodName} ${param.kind}`);
    }
}
//# sourceMappingURL=express-parameters.js.map