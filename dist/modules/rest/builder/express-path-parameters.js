"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processCustomPathParameters = void 0;
const express_error_1 = require("./express-error");
const metadata_1 = require("../metadata");
function validateCustomPathParameterValue(rElement, group) {
    const type = group.getType();
    let value = rElement || '';
    if (group.prefix) {
        value = value.replace(group.prefix, '').trim();
    }
    if (value.length === 0) {
        throw express_error_1.MissingParamError(group.name);
    }
    if (type === String) {
        return value;
    }
    else if (type === Boolean) {
        return Boolean(value);
    }
    else if (type === Number) {
        const number = Number(value);
        if (isNaN(number)) {
            throw express_error_1.InvalidParamError(group.name, 'is not a number');
        }
        if ((group.min !== undefined && number < group.min) ||
            (group.max !== undefined && number > group.max)) {
            throw express_error_1.InvalidParamError(group.name, 'number not in allowed range');
        }
        return number;
    }
    else {
        const enumInfo = metadata_1.getMetadataStorage().enums.find(e => e.enumObj === type);
        if (enumInfo) {
            const enumObj = enumInfo.enumObj;
            if (!enumObj[value]) {
                throw express_error_1.InvalidParamError(group.name, `Enum value not valid`);
            }
            return value;
        }
        throw new Error('Internal: Invalid Custom Path Parameter Type ' + group.name);
    }
}
function processCustomPathParameters(customPathParameters, pathParameters, method) {
    const r = customPathParameters.regex.exec(pathParameters) || [];
    let index = 1;
    const result = {};
    const route = '/' + customPathParameters.groups.filter((g, index) => r[index + 1]).map(g => `${g.prefix || ''}{${g.name}}`).join('');
    const alias = (method.aliasRoutes || []).find(a => a.route === route);
    for (const group of customPathParameters.groups) {
        if (!alias || !alias.hideParameters.includes(group.name)) {
            result[group.name] = validateCustomPathParameterValue(r[index], group);
        }
        index++;
    }
    return result;
}
exports.processCustomPathParameters = processCustomPathParameters;
//# sourceMappingURL=express-path-parameters.js.map