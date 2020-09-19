import {EntityMetadata} from '../definitions/entity-metadata';
import {DataTypes, ModelAttributes, Sequelize} from 'sequelize';
import {ModelAttributeColumnOptions, ModelOptions} from 'sequelize/types/lib/model';
import {PropertyMetadata} from '../definitions/property-metadata';
import {DataType} from 'sequelize/types/lib/data-types';
import {ORM_DATETIME, ORM_FLOAT, ORM_ID, ORM_INT} from '..';
import {ManyToManyFieldRelation, ManyToOneFieldRelation, MappedByOptions, OneToManyFieldRelation, OneToOneFieldRelation, OwnerOptions, PrimaryFieldOptions, RelationOptions} from '../definitions/types';
import {MetadataStorage} from '../metadata/metadata-storage';

export class DBModel {

}

export class ModelBuilder {
	modelMap = new Map<string, any>();

	constructor(private sequelize: Sequelize, private metadata: MetadataStorage) {
	}

	private async buildColumnAttributeModel(field: PropertyMetadata, entity: EntityMetadata): Promise<DataType | ModelAttributeColumnOptions | undefined> {
		const type = field.getType();
		const opts = field.typeOptions;
		const allowNull = opts.nullable === true;
		if (type === ORM_ID && (opts as PrimaryFieldOptions).primaryKey) {
			return {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				allowNull: false,
				unique: true,
				primaryKey: true
			};
		}
		if (type === ORM_ID) {
			return {type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull};
		}
		if (type === Boolean) {
			return {type: DataTypes.BOOLEAN, allowNull};
		}
		if (type === ORM_INT) {
			return {type: DataTypes.INTEGER, allowNull};
		}
		if (type === ORM_DATETIME || type === Date) {
			return {type: DataTypes.DATE, allowNull};
		}
		if (type === ORM_FLOAT || type === Number) {
			return {type: DataTypes.FLOAT, allowNull};
		}
		if (type === String) {
			return {
				type: DataTypes.TEXT,
				allowNull
			};
		}
		const enumInfo = this.metadata.enums.find(e => e.enumObj === type);
		if (enumInfo) {
			return {
				type: DataTypes.TEXT,
				allowNull
			};
		}
		const fObjectType = this.metadata.entities.find(it => it.target === type);
		if (fObjectType) {
			return;
		}
		throw new Error(`Unknown Property Type for ${entity.name}.${field.name}. Maybe an unregistered enum or entity?`);
	}

	private resolveMappedBy(opts: MappedByOptions<any>, sourceEntity: EntityMetadata, sourceField: PropertyMetadata, destEntity: EntityMetadata): PropertyMetadata {
		if (!opts.mappedBy) {
			throw new Error(`Unknown Relation Mapping for ${sourceEntity.name}.${sourceField.name}.`);
		}
		const properties: { [name: string]: PropertyMetadata } = {};
		destEntity.fields.forEach(f => properties[f.name] = f);
		const destField = opts.mappedBy(properties);
		if (!destField) {
			throw new Error(`Unknown Relation Mapping for ${sourceEntity.name}.${sourceField.name}.`);
		}
		return destField;
	}

	private async buildEntityLinks(sourceEntity: EntityMetadata): Promise<void> {
		const sourceModel = this.modelMap.get(sourceEntity.name);
		if (!sourceModel) {
			return;
		}
		for (const sourceField of sourceEntity.fields) {
			const opts = sourceField.typeOptions as RelationOptions;
			if (opts.relation) {
				this.buildRelation(opts, sourceEntity, sourceField, sourceModel);
			}
		}
	}

	private buildRelation(opts: RelationOptions, sourceEntity: EntityMetadata, sourceField: PropertyMetadata, sourceModel: any) {
		const type = sourceField.getType();
		const destEntity = this.metadata.entities.find(it => it.target === type);
		if (destEntity) {
			const destModel = this.modelMap.get(destEntity.name);
			if (destModel) {
				switch (opts.relation) {
					case 'one2many': {
						this.oneToMany(opts, sourceEntity, sourceField, destEntity, sourceModel, destModel);
						break;
					}
					case 'many2one': {
						this.manyToOne(opts, sourceEntity, sourceField, destEntity);
						break;
					}
					case 'many2many': {
						this.manyToMany(opts, sourceEntity, sourceField, destEntity, sourceModel, destModel);
						break;
					}
					case 'one2one': {
						this.oneToOne(opts, sourceEntity, sourceField, destEntity, sourceModel, destModel);
						break;
					}
				}
			}
		}
	}

	private oneToOne(opts: RelationOptions, sourceEntity: EntityMetadata, sourceField: PropertyMetadata, destEntity: EntityMetadata, sourceModel: any, destModel: any) {
		const o2o = (opts as OneToOneFieldRelation<any>);
		const destField = this.resolveMappedBy(o2o, sourceEntity, sourceField, destEntity);
		if ((destField.typeOptions as RelationOptions).relation !== 'one2one') {
			throw new Error(`Invalid OneToOne Relation Spec for ${destEntity.name}.${destField.name}.`);
		}
		if (!o2o.owner && !(destField.typeOptions as OwnerOptions).owner) {
			throw new Error(`Missing owner OneToOne Relation Spec for ${sourceEntity.name}.${sourceField.name} or ${destEntity.name}.${destField.name}.`);
		}
		if (o2o.owner && (destField.typeOptions as OwnerOptions).owner) {
			throw new Error(`Invalid both sides owner OneToOne Relation Spec for ${sourceEntity.name}.${sourceField.name} or ${destEntity.name}.${destField.name}.`);
		}
		if (o2o.owner) {
			sourceModel.belongsTo(destModel, {
				as: sourceField.name + 'ORM',
				foreignKey:
					{
						allowNull: o2o.nullable,
						name: sourceField.name
					}
			});
			// destModel.hasOne(sourceModel, {
			// 	as: sourceField.name // + 'ORM',
			// foreignKey:
			// 	{
			// 		allowNull: o2o.nullable,
			// 		name: destField.name,
			// 		as: destField.name + 'ORM'
			// 	}
			// });
			// console.log(sourceModel.name + ' belongsTo '+destModel.name);
			// console.log(destModel.name + ' hasOne '+sourceModel.name);
		}
	}

	private manyToMany(opts: RelationOptions, sourceEntity: EntityMetadata, sourceField: PropertyMetadata, destEntity: EntityMetadata, sourceModel: any, destModel: any) {
		const m2m = (opts as ManyToManyFieldRelation<any>);
		const destField = this.resolveMappedBy(m2m, sourceEntity, sourceField, destEntity);
		if ((destField.typeOptions as RelationOptions).relation !== 'many2many') {
			throw new Error(`Invalid ManyToMany Relation Spec for ${destEntity.name}.${destField.name}.`);
		}
		const through = [sourceEntity, destEntity].sort((a, b) => a.name.localeCompare(b.name)).map(f => f.name).join('_to_');
		destModel.belongsToMany(sourceModel, {through, as: destField.name + 'ORM', foreignKey: sourceField.name});
	}

	private manyToOne(opts: RelationOptions, sourceEntity: EntityMetadata, sourceField: PropertyMetadata, destEntity: EntityMetadata) {
		const m2o = (opts as ManyToOneFieldRelation<any>);
		const destField = this.resolveMappedBy(m2o, sourceEntity, sourceField, destEntity);
		if ((destField.typeOptions as RelationOptions).relation !== 'one2many') {
			throw new Error(`Invalid OneToMany Relation Spec for ${destEntity.name}.${destField.name}.`);
		}
		// is handled by opposite side
	}

	private oneToMany(opts: RelationOptions, sourceEntity: EntityMetadata, sourceField: PropertyMetadata, destEntity: EntityMetadata, sourceModel: any, destModel: any) {
		const o2m = (opts as OneToManyFieldRelation<any>);
		const destField = this.resolveMappedBy(o2m, sourceEntity, sourceField, destEntity);
		if ((destField.typeOptions as RelationOptions).relation !== 'many2one') {
			throw new Error(`Invalid ManyToOne Relation Spec for ${destEntity.name}.${destField.name}.`);
		}
		// console.log(destModel.name + ' belongsTo ' + sourceModel.name);
		sourceModel.hasMany(destModel, {
			type: DataTypes.UUID,
			as: sourceField.name + 'ORM',
			onDelete: o2m.onDelete,
			foreignKey: destField.name
		});
		destModel.belongsTo(sourceModel, {
			type: DataTypes.UUID,
			as: destField.name + 'ORM',
			// onDelete: o2m.onDelete,
			foreignKey: {
				name: destField.name,
				allowNull: o2m.nullable,
			}
		});
	}

	private async buildEntityModel(entity: EntityMetadata): Promise<void> {
		const attributes: ModelAttributes = {};
		const options: ModelOptions = {
			freezeTableName: true
		};
		for (const field of entity.fields) {
			const attribute = await this.buildColumnAttributeModel(field, entity);
			if (attribute) {
				attributes[field.name] = attribute;
			}
		}
		const model = this.sequelize.define(entity.name, attributes, options);
		this.modelMap.set(entity.name, model);
	}

	async build(): Promise<DBModel> {
		const result = new DBModel();
		const entities = this.metadata.entities.filter(e => !e.isAbstract);
		for (const entity of entities) {
			await this.buildEntityModel(entity);
		}
		for (const entity of entities) {
			await this.buildEntityLinks(entity);
		}
		return result;
	}

}
