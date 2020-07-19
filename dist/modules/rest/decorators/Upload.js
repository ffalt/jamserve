"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Upload = void 0;
const metadata_1 = require("../metadata");
const decorators_1 = require("../helpers/decorators");
const params_1 = require("../helpers/params");
function Upload(name, returnTypeFuncOrOptions, maybeOptions) {
    return (prototype, propertyKey, parameterIndex) => {
        const { options, returnTypeFunc } = decorators_1.getTypeDecoratorParams(returnTypeFuncOrOptions, maybeOptions);
        metadata_1.getMetadataStorage().collectHandlerParamMetadata({
            kind: 'arg',
            name,
            mode: 'file',
            propertyName: String(propertyKey),
            description: options.description,
            example: options.example,
            deprecationReason: options.deprecationReason,
            ...params_1.getParamInfo({ prototype, propertyKey, parameterIndex, returnTypeFunc, options }),
        });
    };
}
exports.Upload = Upload;
//# sourceMappingURL=Upload.js.map