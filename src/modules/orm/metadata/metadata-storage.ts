import { EntityMetadata } from '../definitions/entity-metadata.js';
import { PropertyMetadata } from '../definitions/property-metadata.js';
import { EnumMetadata } from '../../deco/definitions/enum-metadata.js';
import { ensureReflectMetadataExists } from '../../../utils/reflect.js';

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

	private buildFieldMetadata(definitions: Array<PropertyMetadata>): void {
		for (const def of definitions) {
			if (def.isRelation) {
				const type = def.getType();
				def.linkedEntity = this.entities.find(e => e.target === type);
			}
		}
	}

	private buildClassMetadata(definitions: Array<EntityMetadata>): void {
		for (const def of definitions) {
			if (!def.fields || def.fields.length === 0) {
				let fields = this.fields.filter(field => field.target === def.target);
				let superClass = Object.getPrototypeOf(def.target);
				while (superClass.prototype !== undefined) {
					const superArgumentType = definitions.find(it => it.target === superClass);
					if (superArgumentType) {
						fields = [...fields, ...this.fields.filter(field => field.target === superArgumentType.target)];
					}
					superClass = Object.getPrototypeOf(superClass);
				}
				def.fields = fields;
			}
		}
	}

	clear(): void {
		this.entities = [];
		this.fields = [];
		this.enums = [];
	}
}
