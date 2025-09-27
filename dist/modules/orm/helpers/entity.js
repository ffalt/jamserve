import { Reference } from './reference.js';
import { Collection } from './collection.js';
function transformValueForDB(value, field) {
    if (field.typeOptions.array) {
        const list = value ?? [];
        if (list.length === 0) {
            return '';
        }
        return `|${list.join('|')}|`;
    }
    return value;
}
function transformValueForUse(value, field) {
    if (field.typeOptions.array) {
        const arrayValue = `${(value ?? '')}`;
        return arrayValue.split('|').filter(s => s.length > 0);
    }
    return value === null ? undefined : value;
}
export function mapManagedToSource(instance) {
    var _a, _b;
    const source = instance._source;
    for (const field of instance._meta.fields) {
        if (!field.isRelation) {
            source.set(field.name, transformValueForDB(instance[field.name], field));
        }
    }
    (_a = instance._source).createdAt ?? (_a.createdAt = instance.createdAt);
    (_b = instance._source).updatedAt ?? (_b.updatedAt = instance.updatedAt);
}
export function cleanManagedEntityRelations(instance) {
    for (const field of instance._meta.fields) {
        if (field.isRelation) {
            const referenceOrCollection = instance[field.name];
            if (referenceOrCollection instanceof Reference) {
                const reference = referenceOrCollection;
                reference.clear();
            }
            else if (referenceOrCollection instanceof Collection) {
                const collection = referenceOrCollection;
                collection.clear();
            }
        }
    }
}
export async function saveManagedEntityRelations(instance, transaction) {
    for (const field of instance._meta.fields) {
        if (field.isRelation) {
            const referenceOrCollection = instance[field.name];
            if (referenceOrCollection instanceof Collection) {
                const collection = referenceOrCollection;
                await collection.flush(transaction);
            }
        }
    }
}
export function createManagedEntity(meta, source, em) {
    const entity = new meta.target();
    Object.defineProperty(entity, '_em', { enumerable: false, value: em, writable: false });
    Object.defineProperty(entity, '_source', { enumerable: false, value: source, writable: false });
    Object.defineProperty(entity, '_meta', { enumerable: false, value: meta, writable: false });
    for (const field of meta.fields) {
        if (field.isRelation) {
            const referenceOrCollection = entity[field.name];
            if (referenceOrCollection instanceof Reference) {
                const reference = referenceOrCollection;
                reference.manage(field);
            }
            else if (referenceOrCollection instanceof Collection) {
                const collection = referenceOrCollection;
                collection.manage(field);
            }
        }
        else {
            entity[field.name] = transformValueForUse(source.get(field.name), field);
        }
    }
    entity.createdAt = source.get('createdAt');
    entity.updatedAt = source.get('updatedAt');
    return entity;
}
//# sourceMappingURL=entity.js.map