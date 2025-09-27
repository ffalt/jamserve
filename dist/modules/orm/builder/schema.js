import { DataTypes } from 'sequelize';
import { ORM_DATETIME, ORM_FLOAT, ORM_ID, ORM_INT } from '../definitions/orm-types.js';
export class DBModel {
    constructor(db) {
        this.db = db;
    }
}
export class ModelBuilder {
    constructor(sequelize, metadata) {
        this.sequelize = sequelize;
        this.metadata = metadata;
        this.modelMap = new Map();
    }
    async buildColumnAttributeModel(field, entity) {
        const type = field.getType();
        const options = field.typeOptions;
        const allowNull = options.nullable === true;
        if (type === ORM_ID && options.primaryKey) {
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
        const enumInfo = this.metadata.enumInfo(type);
        if (enumInfo) {
            return {
                type: DataTypes.TEXT,
                allowNull
            };
        }
        const fObjectType = this.metadata.entityInfo(type);
        if (fObjectType) {
            return;
        }
        throw new Error(`Unknown Property Type for ${entity.name}.${field.name}. Maybe an unregistered enum or entity?`);
    }
    resolveMappedBy(options, sourceEntity, sourceField, destinationEntity) {
        if (!options.mappedBy) {
            throw new Error(`Unknown Relation Mapping for ${sourceEntity.name}.${sourceField.name}.`);
        }
        const properties = Object.fromEntries(destinationEntity.fields.map(f => [f.name, f]));
        const destinationField = options.mappedBy(properties);
        if (!destinationField) {
            throw new Error(`Unknown Relation Mapping for ${sourceEntity.name}.${sourceField.name}.`);
        }
        return destinationField;
    }
    async buildEntityLinks(sourceEntity) {
        const sourceModel = this.modelMap.get(sourceEntity.name);
        if (!sourceModel) {
            return;
        }
        for (const sourceField of sourceEntity.fields) {
            const options = sourceField.typeOptions;
            if (options.relation) {
                this.buildRelation(options, sourceEntity, sourceField, sourceModel);
            }
        }
    }
    buildRelation(options, sourceEntity, sourceField, sourceModel) {
        const type = sourceField.getType();
        const destinationEntity = this.metadata.entityInfo(type);
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
    oneToOne(options, sourceEntity, sourceField, destinationEntity, sourceModel, destinationModel) {
        const o2o = options;
        const destinationField = this.resolveMappedBy(o2o, sourceEntity, sourceField, destinationEntity);
        if (destinationField.typeOptions.relation !== 'one2one') {
            throw new Error(`Invalid OneToOne Relation Spec for ${destinationEntity.name}.${destinationField.name}.`);
        }
        if (!o2o.owner && !destinationField.typeOptions.owner) {
            throw new Error(`Missing owner OneToOne Relation Spec for ${sourceEntity.name}.${sourceField.name} or ${destinationEntity.name}.${destinationField.name}.`);
        }
        if (o2o.owner && destinationField.typeOptions.owner) {
            throw new Error(`Invalid both sides owner OneToOne Relation Spec for ${sourceEntity.name}.${sourceField.name} or ${destinationEntity.name}.${destinationField.name}.`);
        }
        if (o2o.owner) {
            sourceModel.belongsTo(destinationModel, {
                as: `${sourceField.name}ORM`,
                foreignKey: {
                    allowNull: o2o.nullable,
                    name: sourceField.name
                }
            });
        }
    }
    manyToMany(options, sourceEntity, sourceField, destinationEntity, sourceModel, destinationModel) {
        const m2m = options;
        const destinationField = this.resolveMappedBy(m2m, sourceEntity, sourceField, destinationEntity);
        if (destinationField.typeOptions.relation !== 'many2many') {
            throw new Error(`Invalid ManyToMany Relation Spec for ${destinationEntity.name}.${destinationField.name}.`);
        }
        const through = [sourceEntity, destinationEntity].sort((a, b) => a.name.localeCompare(b.name)).map(f => f.name).join('_to_');
        destinationModel.belongsToMany(sourceModel, { through, as: `${destinationField.name}ORM`, foreignKey: sourceField.name });
    }
    manyToOne(options, sourceEntity, sourceField, destinationEntity) {
        const m2o = options;
        const destinationField = this.resolveMappedBy(m2o, sourceEntity, sourceField, destinationEntity);
        if (destinationField.typeOptions.relation !== 'one2many') {
            throw new Error(`Invalid OneToMany Relation Spec for ${destinationEntity.name}.${destinationField.name}.`);
        }
    }
    oneToMany(options, sourceEntity, sourceField, destinationEntity, sourceModel, destinationModel) {
        const o2m = options;
        const destinationField = this.resolveMappedBy(o2m, sourceEntity, sourceField, destinationEntity);
        if (destinationField.typeOptions.relation !== 'many2one') {
            throw new Error(`Invalid ManyToOne Relation Spec for ${destinationEntity.name}.${destinationField.name}.`);
        }
        sourceModel.hasMany(destinationModel, {
            as: `${sourceField.name}ORM`,
            onDelete: o2m.onDelete,
            foreignKey: destinationField.name
        });
        destinationModel.belongsTo(sourceModel, {
            as: `${destinationField.name}ORM`,
            foreignKey: {
                name: destinationField.name,
                allowNull: o2m.nullable
            }
        });
    }
    async buildEntityModel(entity) {
        const attributes = {};
        for (const field of entity.fields) {
            const attribute = await this.buildColumnAttributeModel(field, entity);
            if (attribute) {
                attributes[field.name] = attribute;
            }
        }
        const model = this.sequelize.define(entity.name, attributes, {
            freezeTableName: true
        });
        this.modelMap.set(entity.name, model);
    }
    async build() {
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
//# sourceMappingURL=schema.js.map