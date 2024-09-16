import { ensureReflectMetadataExists } from '../../../utils/reflect.js';
export class MetadataStorage {
    constructor() {
        this.entities = [];
        this.fields = [];
        this.enums = [];
        this.initialized = false;
        ensureReflectMetadataExists();
    }
    collectEnumMetadata(definition) {
        this.enums.push(definition);
    }
    collectEntityMetadata(definition) {
        this.entities.push(definition);
    }
    collectPropertyMetadata(definition) {
        this.fields.push(definition);
    }
    build() {
        if (!this.initialized) {
            this.buildClassMetadata(this.entities);
            this.buildFieldMetadata(this.fields);
            this.initialized = true;
        }
    }
    buildFieldMetadata(definitions) {
        definitions.forEach(def => {
            if (def.isRelation) {
                const type = def.getType();
                def.linkedEntity = this.entities.find(e => e.target === type);
            }
        });
    }
    buildClassMetadata(definitions) {
        definitions.forEach(def => {
            if (!def.fields || def.fields.length === 0) {
                let fields = this.fields.filter(field => field.target === def.target);
                let superClass = Object.getPrototypeOf(def.target);
                while (superClass.prototype !== undefined) {
                    const superArgumentType = definitions.find(it => it.target === superClass);
                    if (superArgumentType) {
                        fields = fields.concat(this.fields.filter(field => field.target === superArgumentType.target));
                    }
                    superClass = Object.getPrototypeOf(superClass);
                }
                def.fields = fields;
            }
        });
    }
    clear() {
        this.entities = [];
        this.fields = [];
        this.enums = [];
    }
}
//# sourceMappingURL=metadata-storage.js.map