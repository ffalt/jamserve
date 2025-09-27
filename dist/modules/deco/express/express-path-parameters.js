import { invalidParameterError, missingParameterError } from './express-error.js';
function validateCustomPathParameterValue(rElement, group, options) {
    const type = group.getType();
    let value = rElement ?? '';
    if (group.prefix) {
        value = value.replace(group.prefix, '').trim();
    }
    if (value.length === 0) {
        throw missingParameterError(group.name);
    }
    switch (type) {
        case String: {
            return value;
        }
        case Boolean: {
            return Boolean(value);
        }
        case Number: {
            const number = Number(value);
            if (Number.isNaN(number)) {
                throw invalidParameterError(group.name, 'is not a number');
            }
            if ((group.min !== undefined && number < group.min) ||
                (group.max !== undefined && number > group.max)) {
                throw invalidParameterError(group.name, 'number not in allowed range');
            }
            return number;
        }
        default: {
            const enumInfo = options.enums.find(entry => entry.enumObj === type);
            if (enumInfo) {
                const enumObj = enumInfo.enumObj;
                if (!enumObj[value]) {
                    throw invalidParameterError(group.name, 'Enum value not valid');
                }
                return value;
            }
            throw new Error(`Internal: Invalid Custom Path Parameter Type ${group.name}`);
        }
    }
}
export function processCustomPathParameters(customPathParameters, pathParameters, method, options) {
    const r = customPathParameters.regex.exec(pathParameters) ?? [];
    let index = 1;
    const result = {};
    const relativeRoute = customPathParameters.groups.filter((_g, index) => r[index + 1]).map(g => `${g.prefix ?? ''}{${g.name}}`).join('');
    const route = `/${relativeRoute}`;
    const alias = (method.aliasRoutes ?? []).find(a => a.route === route);
    for (const group of customPathParameters.groups) {
        if (!alias || !(alias.hideParameters ?? []).includes(group.name)) {
            result[group.name] = validateCustomPathParameterValue(r[index], group, options);
        }
        index++;
    }
    return result;
}
//# sourceMappingURL=express-path-parameters.js.map