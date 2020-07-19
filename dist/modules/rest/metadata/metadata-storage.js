"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetadataStorage = void 0;
const utils_1 = require("type-graphql/dist/metadata/utils");
class MetadataStorage {
    constructor() {
        this.gets = [];
        this.posts = [];
        this.fieldResolvers = [];
        this.resultTypes = [];
        this.inputTypes = [];
        this.argumentTypes = [];
        this.enums = [];
        this.classDirectives = [];
        this.fieldDirectives = [];
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
    collectFieldResolverMetadata(definition) {
        this.fieldResolvers.push(definition);
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
        this.buildClassMetadata(this.resultTypes);
        this.buildClassMetadata(this.inputTypes);
        this.buildClassMetadata(this.argumentTypes);
        this.buildControllersMetadata(this.gets);
        this.buildControllersMetadata(this.posts);
    }
    clear() {
        this.gets = [];
        this.posts = [];
        this.fieldResolvers = [];
        this.resultTypes = [];
        this.inputTypes = [];
        this.argumentTypes = [];
        this.enums = [];
        this.classDirectives = [];
        this.fieldDirectives = [];
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
                    field.directives = this.fieldDirectives
                        .filter(it => it.target === field.target && it.fieldName === field.name)
                        .map(it => it.directive);
                });
                def.fields = fields;
            }
            if (!def.directives) {
                def.directives = this.classDirectives
                    .filter(it => it.target === def.target)
                    .map(it => it.directive);
            }
        });
    }
    buildControllersMetadata(definitions) {
        definitions.forEach(def => {
            def.controllerClassMetadata = this.controllerClasses.find(resolver => resolver.target === def.target);
            def.params = this.params.filter(param => param.target === def.target && def.methodName === param.methodName);
            def.directives = this.fieldDirectives
                .filter(it => it.target === def.target && it.fieldName === def.methodName)
                .map(it => it.directive);
        });
    }
}
exports.MetadataStorage = MetadataStorage;
//# sourceMappingURL=metadata-storage.js.map