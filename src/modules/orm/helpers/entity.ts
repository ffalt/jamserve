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
		const list = value || [];
		if (list.length === 0) {
			return '';
		}
		return `|${value.join('|')}|`;
	}
	return value;
}

function transformValueForUse(value: any, field: PropertyMetadata): any {
	if (field.typeOptions.array) {
		const val = `${(value || '')}`;
		return val.split('|').filter(s => s.length > 0);
	}
	return value === null ? undefined : value;
}

export function mapManagedToSource(instance: ManagedEntity): void {
	const source: any = instance._source;
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

export function cleanManagedEntityRelations(instance: ManagedEntity): void {
	for (const field of instance._meta.fields) {
		if (field.isRelation) {
			const refOrCollection = instance[field.name];
			if (refOrCollection instanceof Reference) {
				const ref: Reference<any> = refOrCollection;
				ref.clear();
			} else if (refOrCollection instanceof Collection) {
				const collection: Collection<any> = refOrCollection;
				collection.clear();
			}
		}
	}
}

export async function saveManagedEntityRelations(instance: ManagedEntity, transaction?: Transaction): Promise<void> {
	for (const field of instance._meta.fields) {
		if (field.isRelation) {
			const refOrCollection = instance[field.name];
			if (refOrCollection instanceof Collection) {
				const collection: Collection<any> = refOrCollection;
				await collection.flush(transaction);
			}
		}
	}
}

export function createManagedEntity<T extends AnyEntity<T>>(meta: EntityMetadata, source: Model, em: EntityManager): T {
	const entity = new (meta.target as any)();
	Object.defineProperty(entity, '_em', { enumerable: false, value: em, writable: false });
	Object.defineProperty(entity, '_source', { enumerable: false, value: source, writable: false });
	Object.defineProperty(entity, '_meta', { enumerable: false, value: meta, writable: false });
	meta.fields.forEach(field => {
		if (field.isRelation) {
			const refOrCollection = entity[field.name];
			if (refOrCollection instanceof Reference) {
				const ref: Reference<any> = refOrCollection;
				ref.manage(field);
			} else if (refOrCollection instanceof Collection) {
				const collection: Collection<any> = refOrCollection;
				collection.manage(field);
			}
		} else {
			entity[field.name] = transformValueForUse(source.get(field.name), field);
		}
	});
	entity['createdAt'] = source.get('createdAt');
	entity['updatedAt'] = source.get('updatedAt');
	return entity;
}
