import { ensureReflectMetadataExists } from '../../../utils/reflect.js';
export class MetadataStorage {
    constructor() {
        this.initialized = false;
        this.all = [];
        this.gets = [];
        this.posts = [];
        this.resultTypes = [];
        this.inputTypes = [];
        this.parameterTypes = [];
        this.enums = [];
        this.controllerClasses = [];
        this.fields = [];
        this.parameters = [];
        ensureReflectMetadataExists();
    }
    build() {
        if (!this.initialized) {
            this.buildClassMetadata(this.resultTypes);
            this.buildClassMetadata(this.inputTypes);
            this.buildClassMetadata(this.parameterTypes);
            this.buildControllersMetadata(this.all);
            this.buildControllersMetadata(this.gets);
            this.buildControllersMetadata(this.posts);
            this.initialized = true;
        }
    }
    enumInfo(type) {
        return this.enums.find(enumInfo => enumInfo.enumObj === type);
    }
    resultType(type) {
        return this.resultTypes.find(resultType => resultType.target === type);
    }
    buildClassMetadata(definitions) {
        for (const definition of definitions) {
            if (definition.fields.length === 0) {
                const fields = this.fields.filter(field => field.target === definition.target);
                for (const field of fields) {
                    field.params = this.parameters.filter(parameter => parameter.target === field.target && field.name === parameter.methodName);
                }
                definition.fields = fields;
            }
        }
    }
    buildControllersMetadata(definitions) {
        for (const definition of definitions) {
            definition.controllerClassMetadata = this.controllerClasses.find(resolver => resolver.target === definition.target);
            definition.parameters = this.parameters.filter(parameter => parameter.target === definition.target && definition.methodName === parameter.methodName);
        }
    }
}
//# sourceMappingURL=metadata-storage.js.map