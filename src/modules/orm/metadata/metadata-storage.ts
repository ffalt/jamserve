import { EntityMetadata } from '../definitions/entity-metadata.js';
import { PropertyMetadata } from '../definitions/property-metadata.js';
import { EnumMetadata } from '../../deco/definitions/enum-metadata.js';
import { ensureReflectMetadataExists } from '../../../utils/reflect.js';
import { TypeValue } from '../../deco/definitions/types.js';

let ORMMetadataStorage: MetadataStorage | undefined;

export function metadataStorage(): MetadataStorage {
	ORMMetadataStorage ??= new MetadataStorage();
	return ORMMetadataStorage;
}

export class MetadataStorage {
	entities: Array<EntityMetadata> = [];
	fields: Array<PropertyMetadata> = [];
	enums: Array<EnumMetadata> = [];
	initialized = false;

	constructor() {
		ensureReflectMetadataExists();
	}

	build(): void {
		if (!this.initialized) {
			this.buildClassMetadata(this.entities);
			this.buildFieldMetadata(this.fields);
			this.initialized = true;
		}
	}

	enumInfo(type: TypeValue): EnumMetadata | undefined {
		return this.enums.find(enumInfo => enumInfo.enumObj === type);
	}

	entityInfo(type: TypeValue): EntityMetadata | undefined {
		return this.entities.find(entity => entity.target === type);
	}

	entityInfoByTargetName(name: string): EntityMetadata | undefined {
		return this.entities.find(entity => entity.target.name === name);
	}

	entityInfoByName(name: string): EntityMetadata | undefined {
		return this.entities.find(entity => entity.name === name);
	}

	private buildFieldMetadata(definitions: Array<PropertyMetadata>): void {
		for (const definition of definitions) {
			if (definition.isRelation) {
				const type = definition.getType();
				definition.linkedEntity = this.entityInfo(type as TypeValue);
			}
		}
	}

	private buildClassMetadata(definitions: Array<EntityMetadata>): void {
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

	clear(): void {
		this.entities = [];
		this.fields = [];
		this.enums = [];
	}
}
