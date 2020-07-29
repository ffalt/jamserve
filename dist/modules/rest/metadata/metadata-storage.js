"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetadataStorage = void 0;
const utils_1 = require("type-graphql/dist/metadata/utils");
class MetadataStorage {
    constructor() {
        this.initialized = false;
        this.gets = [];
        this.posts = [];
        this.resultTypes = [];
        this.inputTypes = [];
        this.argumentTypes = [];
        this.enums = [];
        this.controllerClasses = [];
        this.fields = [];
        this.params = [];
        utils_1.ensureReflectMetadataExists();
    }
    collectGetHandlerMetadata(definition) {
        this.gets.push(definition);
    }
    collectPostHandlerMetadata(definition) {
        this.posts.push(definition);
    }
    collectResultMetadata(definition) {
        this.resultTypes.push(definition);
    }
    collectArgsMetadata(definition) {
        this.argumentTypes.push(definition);
    }
    collectEnumMetadata(definition) {
        this.enums.push(definition);
    }
    collectControllerClassMetadata(definition) {
        this.controllerClasses.push(definition);
    }
    collectClassFieldMetadata(definition) {
        this.fields.push(definition);
    }
    collectHandlerParamMetadata(definition) {
        this.params.push(definition);
    }
    build() {
        if (!this.initialized) {
            this.buildClassMetadata(this.resultTypes);
            this.buildClassMetadata(this.inputTypes);
            this.buildClassMetadata(this.argumentTypes);
            this.buildControllersMetadata(this.gets);
            this.buildControllersMetadata(this.posts);
            this.initialized = true;
        }
    }
    clear() {
        this.gets = [];
        this.posts = [];
        this.resultTypes = [];
        this.inputTypes = [];
        this.argumentTypes = [];
        this.enums = [];
        this.controllerClasses = [];
        this.fields = [];
        this.params = [];
    }
    buildClassMetadata(definitions) {
        definitions.forEach(def => {
            if (!def.fields || def.fields.length === 0) {
                const fields = this.fields.filter(field => field.target === def.target);
                fields.forEach(field => {
                    field.params = this.params.filter(param => param.target === field.target && field.name === param.methodName);
                });
                def.fields = fields;
            }
        });
    }
    buildControllersMetadata(definitions) {
        definitions.forEach(def => {
            def.controllerClassMetadata = this.controllerClasses.find(resolver => resolver.target === def.target);
            def.params = this.params.filter(param => param.target === def.target && def.methodName === param.methodName);
        });
    }
}
exports.MetadataStorage = MetadataStorage;
//# sourceMappingURL=metadata-storage.js.map