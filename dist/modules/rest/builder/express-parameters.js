"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressParameters = void 0;
const enums_1 = require("../helpers/enums");
const express_error_1 = require("./express-error");
const metadata_1 = require("../metadata");
const default_value_1 = require("../helpers/default-value");
const iterate_super_1 = require("../helpers/iterate-super");
class ExpressParameters {
    constructor() {
        this.metadata = metadata_1.getMetadataStorage();
    }
    validateBoolean(value, typeOptions, param) {
        if (typeOptions.array) {
            throw express_error_1.InvalidParamError(param.name);
        }
        if (typeof value !== 'boolean') {
            if (value === 'true') {
                return true;
            }
            else if (value === 'false') {
                return false;
            }
            else {
                throw express_error_1.InvalidParamError(param.name);
            }
        }
        return value;
    }
    validateNumber(value, typeOptions, param) {
        if (typeOptions.array) {
            throw express_error_1.InvalidParamError(param.name);
        }
        if (typeof value === 'string' && value.length === 0) {
            throw express_error_1.InvalidParamError(param.name);
        }
        const val = Number(value);
        if (isNaN(val)) {
            throw express_error_1.InvalidParamError(param.name, `Parameter value is not a number`);
        }
        if (val % 1 !== 0) {
            throw express_error_1.InvalidParamError(param.name, `Parameter value is not an integer`);
        }
        if (typeOptions.min !== undefined && val < typeOptions.min) {
            throw express_error_1.InvalidParamError(param.name, `Parameter value too small`);
        }
        if (typeOptions.max !== undefined && val > typeOptions.max) {
            throw express_error_1.InvalidParamError(param.name, `Parameter value too high`);
        }
        return val;
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
                    throw express_error_1.InvalidParamError(param.name);
                }
                array = [s];
            }
            return array.map((v) => String(v)).filter((v) => {
                if (v.length === 0 && !typeOptions.nullable) {
                    throw express_error_1.InvalidParamError(param.name);
                }
                return v.length > 0;
            });
        }
        else {
            const val = String(value);
            if (val.length === 0) {
                throw express_error_1.InvalidParamError(param.name);
            }
            return val;
        }
    }
    validateEnum(value, typeOptions, param, enumInfo) {
        const enumObj = enumInfo.enumObj;
        const enumValues = enums_1.getEnumReverseValuesMap(enumObj);
        if (typeOptions.array) {
            let array = Array.isArray(value) ? value : [value];
            array = (array || []).map((v) => String(v)).filter(s => s.length > 0);
            for (const val of array) {
                if (!enumValues[val]) {
                    throw express_error_1.InvalidParamError(param.name, `Enum value not valid`);
                }
            }
            return array;
        }
        else {
            const val = String(value);
            if (!enumValues[val]) {
                throw express_error_1.InvalidParamError(param.name, `Enum value not valid`);
            }
            return val;
        }
    }
    validateObjOrFail(value, typeOptions, param, type) {
        if (typeof value !== 'object') {
            throw new Error(`Internal: Invalid Parameter Object Type for field '${param.name}'`);
        }
        const argumentType = this.metadata.argumentTypes.find(it => it.target === type);
        if (argumentType) {
            const result = new argumentType.target();
            for (const field of argumentType.fields) {
                result[field.name] = this.validateParameter(field, value, true);
            }
            return result;
        }
        if (param.typeOptions.generic) {
            return value;
        }
        throw new Error(`Internal: Unknown Parameter Type, did you forget to register an enum? '${param.name}'`);
    }
    validateParameter(param, data, isField) {
        if (isField) {
            const argumentInstance = new param.target();
            param.typeOptions.defaultValue = default_value_1.getDefaultValue(argumentInstance, param.typeOptions, param.name);
        }
        let value = data[param.name];
        if (value === undefined) {
            value = param.typeOptions.defaultValue;
        }
        const typeOptions = param.typeOptions;
        const isNull = (value === undefined || value === null);
        if (!typeOptions.nullable && isNull) {
            throw express_error_1.MissingParamError(param.name);
        }
        if (isNull) {
            return;
        }
        const type = param.getType();
        if (type === Boolean) {
            value = this.validateBoolean(value, typeOptions, param);
        }
        else if (type === Number) {
            value = this.validateNumber(value, typeOptions, param);
        }
        else if (type === String) {
            value = this.validateString(value, typeOptions, param);
        }
        else {
            const enumInfo = this.metadata.enums.find(e => e.enumObj === type);
            if (enumInfo) {
                value = this.validateEnum(value, typeOptions, param, enumInfo);
            }
            else {
                value = this.validateObjOrFail(value, typeOptions, param, type);
            }
        }
        return value;
    }
    getData(mode, context) {
        switch (mode) {
            case 'body':
                return context.req.body;
            case 'query':
                return context.req.query;
            case 'path':
                return context.req.params;
            case 'file': {
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
    prepareParameterSingle(param, context) {
        return this.validateParameter(param, this.getData(param.mode, context), false);
    }
    mapArgFields(argumentType, data, args = {}) {
        argumentType.fields.forEach(field => {
            args[field.name] = this.validateParameter(field, data, true);
        });
    }
    prepareParameterObj(param, context) {
        const type = param.getType();
        const argumentType = this.metadata.argumentTypes.find(it => it.target === type);
        if (!argumentType) {
            throw express_error_1.GenericError(`The value used as a type of '@QueryParams' for '${param.propertyName}' of '${param.target.name}.${param.methodName}' ` +
                `is not a class decorated with '@ObjParamsType' decorator!`);
        }
        const args = {};
        const data = this.getData(param.mode, context);
        iterate_super_1.iterateArguments(this.metadata, argumentType, argument => {
            this.mapArgFields(argument, data, args);
        });
        return args;
    }
    validateArgument(param, context) {
        switch (param.kind) {
            case 'context':
                return param.propertyName ? context[param.propertyName] : context;
            case 'arg': {
                return this.prepareParameterSingle(param, context);
            }
            case 'args':
                return this.prepareParameterObj(param, context);
        }
        throw express_error_1.GenericError(`Internal: not implemented ${param.methodName} ${param.kind}`);
    }
}
exports.ExpressParameters = ExpressParameters;
//# sourceMappingURL=express-parameters.js.map