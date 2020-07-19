"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryParam = void 0;
const metadata_1 = require("../metadata");
const decorators_1 = require("../helpers/decorators");
const params_1 = require("../helpers/params");
function QueryParam(name, returnTypeFuncOrOptions, maybeOptions) {
    return (prototype, propertyKey, parameterIndex) => {
        const { options, returnTypeFunc } = decorators_1.getTypeDecoratorParams(returnTypeFuncOrOptions, maybeOptions);
        metadata_1.getMetadataStorage().collectHandlerParamMetadata({
            kind: 'arg',
            name,
            mode: 'query',
            propertyName: String(propertyKey),
            isID: options.isID,
            description: options.description,
            example: options.example,
            deprecationReason: options.deprecationReason,
            ...params_1.getParamInfo({ prototype, propertyKey, parameterIndex, returnTypeFunc, options }),
        });
    };
}
exports.QueryParam = QueryParam;
//# sourceMappingURL=QueryParam.js.map