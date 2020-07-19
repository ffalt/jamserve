"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BodyParams = void 0;
const metadata_1 = require("../metadata");
const decorators_1 = require("../helpers/decorators");
const params_1 = require("../helpers/params");
function BodyParams(paramTypeFnOrOptions, maybeOptions) {
    const { options, returnTypeFunc } = decorators_1.getTypeDecoratorParams(paramTypeFnOrOptions, maybeOptions);
    return (prototype, propertyKey, parameterIndex) => {
        metadata_1.getMetadataStorage().collectHandlerParamMetadata({
            kind: 'args',
            mode: 'body',
            propertyName: String(propertyKey),
            ...params_1.getParamInfo({ prototype, propertyKey, parameterIndex, returnTypeFunc, options }),
        });
    };
}
exports.BodyParams = BodyParams;
//# sourceMappingURL=BodyParams.js.map