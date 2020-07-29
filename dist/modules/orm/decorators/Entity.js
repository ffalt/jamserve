"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entity = void 0;
const getMetadataStorage_1 = require("../metadata/getMetadataStorage");
const decorators_1 = require("../helpers/decorators");
function Entity(nameOrOptions, maybeOptions) {
    const { name, options } = decorators_1.getNameDecoratorParams(nameOrOptions, maybeOptions);
    return target => {
        getMetadataStorage_1.getMetadataStorage().collectEntityMetadata({
            name: name || target.name,
            target,
            fields: [],
            isAbstract: options.isAbstract
        });
    };
}
exports.Entity = Entity;
//# sourceMappingURL=Entity.js.map