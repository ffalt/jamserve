import { EntityMetadata } from '../definitions/entity-metadata.js';
import { Sequelize, DataType, ModelAttributeColumnOptions, Model, DataTypes } from 'sequelize';
import { PropertyMetadata } from '../definitions/property-metadata.js';
import { ORM_DATETIME, ORM_FLOAT, ORM_ID, ORM_INT } from '../definitions/orm-types.js';
import { ManyToManyFieldRelation, ManyToOneFieldRelation, MappedByOptions, OneToManyFieldRelation, OneToOneFieldRelation, OwnerOptions, PrimaryFieldOptions, RelationOptions, TypeValue } from '../definitions/types.js';
import { MetadataStorage } from '../metadata/metadata-storage.js';
import { Attributes, ModelAttributes, ModelStatic } from 'sequelize/lib/model';

export class DBModel {
	constructor(public readonly db: boolean) {
	}
}

export class ModelBuilder {
	readonly modelMap = new Map<string, ModelStatic<any>>();

	constructor(private readonly sequelize: Sequelize, private readonly metadata: MetadataStorage) {
	}

	private async buildColumnAttributeModel(field: PropertyMetadata, entity: EntityMetadata): Promise<DataType | ModelAttributeColumnOptions | undefined> {
		const type = field.getType();
		const options = field.typeOptions;
		const allowNull = options.nullable === true;
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		if (type === ORM_ID && (options as PrimaryFieldOptions).primaryKey) {
			return {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				allowNull: false,
				unique: true,
				primaryKey: true
			};
		}
		if (type === ORM_ID) {
			return { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull };
		}
		if (type === Boolean) {
			return { type: DataTypes.BOOLEAN, allowNull };
		}
		if (type === ORM_INT) {
			return { type: DataTypes.INTEGER, allowNull };
		}
		if (type === ORM_DATETIME || type === Date) {
			return { type: DataTypes.DATE, allowNull };
		}
		if (type === ORM_FLOAT || type === Number) {
			return { type: DataTypes.FLOAT, allowNull };
		}
		if (type === String) {
			return {
				type: DataTypes.TEXT,
				allowNull
			};
		}
		const enumInfo = this.metadata.enumInfo(type as TypeValue);
		if (enumInfo) {
			return {
				type: DataTypes.TEXT,
				allowNull
			};
		}
		const fObjectType = this.metadata.entityInfo(type as TypeValue);
		if (fObjectType) {
			return;
		}
		throw new Error(`Unknown Property Type for ${entity.name}.${field.name}. Maybe an unregistered enum or entity?`);
	}

	private resolveMappedBy(options: MappedByOptions<any>, sourceEntity: EntityMetadata, sourceField: PropertyMetadata, destinationEntity: EntityMetadata): PropertyMetadata {
		if (!options.mappedBy) {
			throw new Error(`Unknown Relation Mapping for ${sourceEntity.name}.${sourceField.name}.`);
		}
		const properties: Record<string, PropertyMetadata> =
			Object.fromEntries(destinationEntity.fields.map(f => [f.name, f] as const));
		const destinationField: PropertyMetadata | undefined = options.mappedBy(properties);
		if (!destinationField) {
			throw new Error(`Unknown Relation Mapping for ${sourceEntity.name}.${sourceField.name}.`);
		}
		return destinationField;
	}

	private async buildEntityLinks(sourceEntity: EntityMetadata): Promise<void> {
		const sourceModel = this.modelMap.get(sourceEntity.name);
		if (!sourceModel) {
			return;
		}
		for (const sourceField of sourceEntity.fields) {
			const options = sourceField.typeOptions as RelationOptions;
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			if (options.relation) {
				this.buildRelation(options, sourceEntity, sourceField, sourceModel);
			}
		}
	}

	private buildRelation(options: RelationOptions, sourceEntity: EntityMetadata, sourceField: PropertyMetadata, sourceModel: ModelStatic<any>) {
		const type = sourceField.getType();
		const destinationEntity = this.metadata.entityInfo(type as TypeValue);
		if (destinationEntity) {
			const destinationModel = this.modelMap.get(destinationEntity.name);
			if (destinationModel) {
				switch (options.relation) {
					case 'one2many': {
						this.oneToMany(options, sourceEntity, sourceField, destinationEntity, sourceModel, destinationModel);
						break;
					}
					case 'many2one': {
						this.manyToOne(options, sourceEntity, sourceField, destinationEntity);
						break;
					}
					case 'many2many': {
						this.manyToMany(options, sourceEntity, sourceField, destinationEntity, sourceModel, destinationModel);
						break;
					}
					case 'one2one': {
						this.oneToOne(options, sourceEntity, sourceField, destinationEntity, sourceModel, destinationModel);
						break;
					}
				}
			}
		}
	}

	private oneToOne(options: RelationOptions, sourceEntity: EntityMetadata, sourceField: PropertyMetadata, destinationEntity: EntityMetadata, sourceModel: ModelStatic<any>, destinationModel: ModelStatic<any>) {
		const o2o = options as OneToOneFieldRelation<any>;
		const destinationField = this.resolveMappedBy(o2o, sourceEntity, sourceField, destinationEntity);
		if ((destinationField.typeOptions as RelationOptions).relation !== 'one2one') {
			throw new Error(`Invalid OneToOne Relation Spec for ${destinationEntity.name}.${destinationField.name}.`);
		}
		if (!o2o.owner && !(destinationField.typeOptions as OwnerOptions).owner) {
			throw new Error(`Missing owner OneToOne Relation Spec for ${sourceEntity.name}.${sourceField.name} or ${destinationEntity.name}.${destinationField.name}.`);
		}
		if (o2o.owner && (destinationField.typeOptions as OwnerOptions).owner) {
			throw new Error(`Invalid both sides owner OneToOne Relation Spec for ${sourceEntity.name}.${sourceField.name} or ${destinationEntity.name}.${destinationField.name}.`);
		}
		if (o2o.owner) {
			sourceModel.belongsTo(destinationModel, {
				as: `${sourceField.name}ORM`,
				foreignKey:
					{
						allowNull: o2o.nullable,
						name: sourceField.name
					}
			});
		}
	}

	private manyToMany(options: RelationOptions, sourceEntity: EntityMetadata, sourceField: PropertyMetadata, destinationEntity: EntityMetadata, sourceModel: ModelStatic<any>, destinationModel: ModelStatic<any>) {
		const m2m = options as ManyToManyFieldRelation<any>;
		const destinationField = this.resolveMappedBy(m2m, sourceEntity, sourceField, destinationEntity);
		if ((destinationField.typeOptions as RelationOptions).relation !== 'many2many') {
			throw new Error(`Invalid ManyToMany Relation Spec for ${destinationEntity.name}.${destinationField.name}.`);
		}
		const through = [sourceEntity, destinationEntity].sort((a, b) => a.name.localeCompare(b.name)).map(f => f.name).join('_to_');
		destinationModel.belongsToMany(sourceModel, { through, as: `${destinationField.name}ORM`, foreignKey: sourceField.name });
	}

	private manyToOne(options: RelationOptions, sourceEntity: EntityMetadata, sourceField: PropertyMetadata, destinationEntity: EntityMetadata) {
		const m2o = options as ManyToOneFieldRelation<any>;
		const destinationField = this.resolveMappedBy(m2o, sourceEntity, sourceField, destinationEntity);
		if ((destinationField.typeOptions as RelationOptions).relation !== 'one2many') {
			throw new Error(`Invalid OneToMany Relation Spec for ${destinationEntity.name}.${destinationField.name}.`);
		}
		// is handled by opposite side
	}

	private oneToMany(options: RelationOptions, sourceEntity: EntityMetadata, sourceField: PropertyMetadata, destinationEntity: EntityMetadata, sourceModel: ModelStatic<any>, destinationModel: ModelStatic<any>) {
		const o2m = options as OneToManyFieldRelation<any>;
		const destinationField = this.resolveMappedBy(o2m, sourceEntity, sourceField, destinationEntity);
		if ((destinationField.typeOptions as RelationOptions).relation !== 'many2one') {
			throw new Error(`Invalid ManyToOne Relation Spec for ${destinationEntity.name}.${destinationField.name}.`);
		}
		sourceModel.hasMany(destinationModel, {
			// type: seq.DataTypes.UUID,
			as: `${sourceField.name}ORM`,
			onDelete: o2m.onDelete,
			foreignKey: destinationField.name
		});
		destinationModel.belongsTo(sourceModel, {
			// type: seq.DataTypes.UUID,
			as: `${destinationField.name}ORM`,
			foreignKey: {
				name: destinationField.name,
				allowNull: o2m.nullable
			}
		});
	}

	private async buildEntityModel<T extends Model>(entity: EntityMetadata): Promise<void> {
		const attributes: Record<string, DataType | ModelAttributeColumnOptions<T>> = {};
		for (const field of entity.fields) {
			const attribute = await this.buildColumnAttributeModel(field, entity);
			if (attribute) {
				attributes[field.name] = attribute;
			}
		}
		const model = this.sequelize.define<T>(entity.name, attributes as ModelAttributes<T, Attributes<T>>, {
			freezeTableName: true
		});
		this.modelMap.set(entity.name, model);
	}

	async build(): Promise<DBModel> {
		const result = new DBModel(true);
		const entities = this.metadata.entities.filter(entity => !entity.isAbstract);
		for (const entity of entities) {
			await this.buildEntityModel(entity);
		}
		for (const entity of entities) {
			await this.buildEntityLinks(entity);
		}
		return result;
	}
}
