import { ensureReflectMetadataExists } from '../../../utils/reflect.js';
export class MetadataStorage {
    constructor() {
        this.initialized = false;
        this.all = [];
        this.gets = [];
        this.posts = [];
        this.resultTypes = [];
        this.inputTypes = [];
        this.argumentTypes = [];
        this.enums = [];
        this.controllerClasses = [];
        this.fields = [];
        this.params = [];
        ensureReflectMetadataExists();
    }
    build() {
        if (!this.initialized) {
            this.buildClassMetadata(this.resultTypes);
            this.buildClassMetadata(this.inputTypes);
            this.buildClassMetadata(this.argumentTypes);
            this.buildControllersMetadata(this.all);
            this.buildControllersMetadata(this.gets);
            this.buildControllersMetadata(this.posts);
            this.initialized = true;
        }
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
//# sourceMappingURL=metadata-storage.js.map