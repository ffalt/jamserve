import { ensureReflectMetadataExists } from '../../../utils/reflect.js';
let ORMMetadataStorage;
export function metadataStorage() {
    ORMMetadataStorage ?? (ORMMetadataStorage = new MetadataStorage());
    return ORMMetadataStorage;
}
export class MetadataStorage {
    constructor() {
        this.entities = [];
        this.fields = [];
        this.enums = [];
        this.initialized = false;
        ensureReflectMetadataExists();
    }
    build() {
        if (!this.initialized) {
            this.buildClassMetadata(this.entities);
            this.buildFieldMetadata(this.fields);
            this.initialized = true;
        }
    }
    enumInfo(type) {
        return this.enums.find(enumInfo => enumInfo.enumObj === type);
    }
    entityInfo(type) {
        return this.entities.find(entity => entity.target === type);
    }
    entityInfoByTargetName(name) {
        return this.entities.find(entity => entity.target.name === name);
    }
    entityInfoByName(name) {
        return this.entities.find(entity => entity.name === name);
    }
    buildFieldMetadata(definitions) {
        for (const definition of definitions) {
            if (definition.isRelation) {
                const type = definition.getType();
                definition.linkedEntity = this.entityInfo(type);
            }
        }
    }
    buildClassMetadata(definitions) {
        for (const definition of definitions) {
            if (definition.fields.length === 0) {
                let fields = this.fields.filter(field => field.target === definition.target);
                let superClass = Object.getPrototypeOf(definition.target);
                while (superClass.prototype !== undefined) {
                    const superParameterType = definitions.find(it => it.target === superClass);
                    if (superParameterType) {
                        fields = [...fields, ...this.fields.filter(field => field.target === superParameterType.target)];
                    }
                    superClass = Object.getPrototypeOf(superClass);
                }
                definition.fields = fields;
            }
        }
    }
    clear() {
        this.entities = [];
        this.fields = [];
        this.enums = [];
    }
}
//# sourceMappingURL=metadata-storage.js.map