import { InvalidParamError, MissingParamError } from './express-error';
import { getMetadataStorage } from '../metadata';
function validateCustomPathParameterValue(rElement, group) {
    const type = group.getType();
    let value = rElement || '';
    if (group.prefix) {
        value = value.replace(group.prefix, '').trim();
    }
    if (value.length === 0) {
        throw MissingParamError(group.name);
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
            throw InvalidParamError(group.name, 'is not a number');
        }
        if ((group.min !== undefined && number < group.min) ||
            (group.max !== undefined && number > group.max)) {
            throw InvalidParamError(group.name, 'number not in allowed range');
        }
        return number;
    }
    else {
        const enumInfo = getMetadataStorage().enums.find(e => e.enumObj === type);
        if (enumInfo) {
            const enumObj = enumInfo.enumObj;
            if (!enumObj[value]) {
                throw InvalidParamError(group.name, `Enum value not valid`);
            }
            return value;
        }
        throw new Error('Internal: Invalid Custom Path Parameter Type ' + group.name);
    }
}
export function processCustomPathParameters(customPathParameters, pathParameters, method) {
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
//# sourceMappingURL=express-path-parameters.js.map