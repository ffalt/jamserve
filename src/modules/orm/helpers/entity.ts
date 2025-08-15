import { ManagedEntity } from '../definitions/managed-entity.js';
import { PropertyMetadata } from '../definitions/property-metadata.js';
import { AnyEntity } from '../typings.js';
import { EntityMetadata } from '../definitions/entity-metadata.js';
import { Model, Transaction } from 'sequelize';
import { EntityManager } from './manager.js';
import { Reference } from './reference.js';
import { Collection } from './collection.js';

function transformValueForDB(value: any, field: PropertyMetadata): any {
	if (field.typeOptions.array) {
		const list: Array<any> = value ?? [];
		if (list.length === 0) {
			return '';
		}
		return `|${list.join('|')}|`;
	}
	return value;
}

function transformValueForUse(value: any, field: PropertyMetadata): any {
	if (field.typeOptions.array) {
		const arrayValue = `${(value ?? '')}`;
		return arrayValue.split('|').filter(s => s.length > 0);
	}
	return value === null ? undefined : value;
}

export function mapManagedToSource(instance: ManagedEntity): void {
	const source = instance._source;
	for (const field of instance._meta.fields) {
		if (!field.isRelation) {
			source.set(field.name, transformValueForDB(instance[field.name], field));
		}
	}
	instance._source.createdAt ??= instance.createdAt;
	instance._source.updatedAt ??= instance.updatedAt;
}

export function cleanManagedEntityRelations(instance: ManagedEntity): void {
	for (const field of instance._meta.fields) {
		if (field.isRelation) {
			const referenceOrCollection = instance[field.name];
			if (referenceOrCollection instanceof Reference) {
				const reference: Reference<any> = referenceOrCollection;
				reference.clear();
			} else if (referenceOrCollection instanceof Collection) {
				const collection: Collection<any> = referenceOrCollection;
				collection.clear();
			}
		}
	}
}

export async function saveManagedEntityRelations(instance: ManagedEntity, transaction?: Transaction): Promise<void> {
	for (const field of instance._meta.fields) {
		if (field.isRelation) {
			const referenceOrCollection = instance[field.name];
			if (referenceOrCollection instanceof Collection) {
				const collection: Collection<any> = referenceOrCollection;
				await collection.flush(transaction);
			}
		}
	}
}

export function createManagedEntity<T extends AnyEntity<T>>(meta: EntityMetadata, source: Model, em: EntityManager): T {
	const entity = new (meta.target as new () => Record<string, unknown>)();
	Object.defineProperty(entity, '_em', { enumerable: false, value: em, writable: false });
	Object.defineProperty(entity, '_source', { enumerable: false, value: source, writable: false });
	Object.defineProperty(entity, '_meta', { enumerable: false, value: meta, writable: false });
	for (const field of meta.fields) {
		if (field.isRelation) {
			const referenceOrCollection = entity[field.name];
			if (referenceOrCollection instanceof Reference) {
				const reference: Reference<any> = referenceOrCollection;
				reference.manage(field);
			} else if (referenceOrCollection instanceof Collection) {
				const collection: Collection<any> = referenceOrCollection;
				collection.manage(field);
			}
		} else {
			entity[field.name] = transformValueForUse(source.get(field.name), field);
		}
	}
	entity.createdAt = source.get('createdAt');
	entity.updatedAt = source.get('updatedAt');
	return entity as T;
}
