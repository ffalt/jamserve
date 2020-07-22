import {ensureReflectMetadataExists} from 'type-graphql/dist/metadata/utils';
import {EntityMetadata} from '../definitions/entity-metadata';
import {PropertyMetadata} from '../definitions/property-metadata';
import {EnumMetadata} from '../../rest/definitions/enum-metadata';

export class MetadataStorage {
	entities: EntityMetadata[] = [];
	fields: PropertyMetadata[] = [];
	enums: EnumMetadata[] = [];
	initialized = false;

	constructor() {
		ensureReflectMetadataExists();
	}

	collectEnumMetadata(definition: EnumMetadata): void {
		this.enums.push(definition);
	}

	collectEntityMetadata(definition: EntityMetadata): void {
		this.entities.push(definition);
	}

	collectPropertyMetadata(definition: PropertyMetadata): void {
		this.fields.push(definition);
	}

	build(): void {
		if (!this.initialized) {
			this.buildClassMetadata(this.entities);
			this.buildFieldMetadata(this.fields);
			this.initialized = true;
		}
	}

	private buildFieldMetadata(definitions: PropertyMetadata[]): void {
		definitions.forEach(def => {
			if (def.isRelation) {
				const type = def.getType();
				def.linkedEntity = this.entities.find(e => e.target === type);
			}
		});
	}

	private buildClassMetadata(definitions: EntityMetadata[]): void {
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


	clear(): void {
		this.entities = [];
		this.fields = [];
		this.enums = [];
	}

}
