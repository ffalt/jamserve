"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createManagedEntity = exports.saveManagedEntityRelations = exports.cleanManagedEntityRelations = exports.saveManagedEntity = exports.mapManagedToSource = void 0;
const reference_1 = require("./reference");
const collection_1 = require("./collection");
function transformValueForDB(value, field) {
    if (field.typeOptions.array) {
        const list = value || [];
        if (list.length === 0) {
            return '';
        }
        return `|${value.join('|')}|`;
    }
    return value;
}
function transformValueForUse(value, field) {
    if (field.typeOptions.array) {
        const val = `${(value || '')}`;
        return val.split('|').filter(s => s.length > 0);
    }
    return value === null ? undefined : value;
}
function mapManagedToSource(instance) {
    const source = instance._source;
    instance._meta.fields.forEach(field => {
        if (!field.isRelation) {
            source.set(field.name, transformValueForDB(instance[field.name], field));
        }
    });
    if (!instance._source.createdAt) {
        instance._source.createdAt = instance.createdAt;
    }
    if (!instance._source.updatedAt) {
        instance._source.updatedAt = instance.updatedAt;
    }
}
exports.mapManagedToSource = mapManagedToSource;
async function saveManagedEntity(instance) {
    mapManagedToSource(instance);
    await instance._source.save();
}
exports.saveManagedEntity = saveManagedEntity;
function cleanManagedEntityRelations(instance) {
    for (const field of instance._meta.fields) {
        if (field.isRelation) {
            const refOrCollection = instance[field.name];
            if (refOrCollection instanceof reference_1.Reference) {
                const ref = refOrCollection;
                ref.clear();
            }
            else if (refOrCollection instanceof collection_1.Collection) {
                const collection = refOrCollection;
                collection.clear();
            }
        }
    }
}
exports.cleanManagedEntityRelations = cleanManagedEntityRelations;
async function saveManagedEntityRelations(instance, transaction) {
    for (const field of instance._meta.fields) {
        if (field.isRelation) {
            const refOrCollection = instance[field.name];
            if (refOrCollection instanceof collection_1.Collection) {
                const collection = refOrCollection;
                await collection.flush(transaction);
            }
        }
    }
}
exports.saveManagedEntityRelations = saveManagedEntityRelations;
function createManagedEntity(meta, source, em) {
    const entity = new meta.target();
    Object.defineProperty(entity, '_em', { enumerable: false, value: em, writable: false });
    Object.defineProperty(entity, '_source', { enumerable: false, value: source, writable: false });
    Object.defineProperty(entity, '_meta', { enumerable: false, value: meta, writable: false });
    meta.fields.forEach(field => {
        if (field.isRelation) {
            const refOrCollection = entity[field.name];
            if (refOrCollection instanceof reference_1.Reference) {
                const ref = refOrCollection;
                ref.manage(field);
            }
            else if (refOrCollection instanceof collection_1.Collection) {
                const collection = refOrCollection;
                collection.manage(field);
            }
        }
        else {
            entity[field.name] = transformValueForUse(source.get(field.name), field);
        }
    });
    entity['createdAt'] = source.get('createdAt');
    entity['updatedAt'] = source.get('updatedAt');
    return entity;
}
exports.createManagedEntity = createManagedEntity;
//# sourceMappingURL=entity.js.map