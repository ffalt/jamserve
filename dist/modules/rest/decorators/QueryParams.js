"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryParams = void 0;
const metadata_1 = require("../metadata");
const decorators_1 = require("../helpers/decorators");
const params_1 = require("../helpers/params");
const extract_property_name_1 = require("../helpers/extract-property-name");
function QueryParams(paramTypeFnOrOptions, maybeOptions) {
    const { options, returnTypeFunc } = decorators_1.getTypeDecoratorParams(paramTypeFnOrOptions, maybeOptions);
    return (prototype, propertyKey, parameterIndex) => {
        metadata_1.getMetadataStorage().collectHandlerParamMetadata({
            kind: 'args',
            mode: 'query',
            propertyName: extract_property_name_1.extractPropertyName(prototype, propertyKey, parameterIndex),
            ...params_1.getParamInfo({ prototype, propertyKey, parameterIndex, returnTypeFunc, options }),
        });
    };
}
exports.QueryParams = QueryParams;
//# sourceMappingURL=QueryParams.js.map