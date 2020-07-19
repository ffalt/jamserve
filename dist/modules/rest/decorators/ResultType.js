"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResultType = void 0;
const getMetadataStorage_1 = require("../metadata/getMetadataStorage");
const decorators_1 = require("../helpers/decorators");
function ResultType(nameOrOptions, maybeOptions) {
    const { name, options } = decorators_1.getNameDecoratorParams(nameOrOptions, maybeOptions);
    const interfaceClasses = options.implements && [].concat(options.implements);
    return target => {
        getMetadataStorage_1.getMetadataStorage().collectResultMetadata({
            name: name || target.name,
            target,
            fields: [],
            description: options.description,
            interfaceClasses,
            isAbstract: options.isAbstract
        });
    };
}
exports.ResultType = ResultType;
//# sourceMappingURL=ResultType.js.map