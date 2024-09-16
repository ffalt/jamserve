import seq from 'sequelize';
import { ORM_DATETIME, ORM_FLOAT, ORM_ID, ORM_INT } from '../definitions/orm-types.js';
export class DBModel {
}
export class ModelBuilder {
    constructor(sequelize, metadata) {
        this.sequelize = sequelize;
        this.metadata = metadata;
        this.modelMap = new Map();
    }
    async buildColumnAttributeModel(field, entity) {
        const type = field.getType();
        const opts = field.typeOptions;
        const allowNull = opts.nullable === true;
        if (type === ORM_ID && opts.primaryKey) {
            return {
                type: seq.DataTypes.UUID,
                defaultValue: seq.DataTypes.UUIDV4,
                allowNull: false,
                unique: true,
                primaryKey: true
            };
        }
        if (type === ORM_ID) {
            return { type: seq.DataTypes.UUID, defaultValue: seq.DataTypes.UUIDV4, allowNull };
        }
        if (type === Boolean) {
            return { type: seq.DataTypes.BOOLEAN, allowNull };
        }
        if (type === ORM_INT) {
            return { type: seq.DataTypes.INTEGER, allowNull };
        }
        if (type === ORM_DATETIME || type === Date) {
            return { type: seq.DataTypes.DATE, allowNull };
        }
        if (type === ORM_FLOAT || type === Number) {
            return { type: seq.DataTypes.FLOAT, allowNull };
        }
        if (type === String) {
            return {
                type: seq.DataTypes.TEXT,
                allowNull
            };
        }
        const enumInfo = this.metadata.enums.find(e => e.enumObj === type);
        if (enumInfo) {
            return {
                type: seq.DataTypes.TEXT,
                allowNull
            };
        }
        const fObjectType = this.metadata.entities.find(it => it.target === type);
        if (fObjectType) {
            return;
        }
        throw new Error(`Unknown Property Type for ${entity.name}.${field.name}. Maybe an unregistered enum or entity?`);
    }
    resolveMappedBy(opts, sourceEntity, sourceField, destEntity) {
        if (!opts.mappedBy) {
            throw new Error(`Unknown Relation Mapping for ${sourceEntity.name}.${sourceField.name}.`);
        }
        const properties = {};
        destEntity.fields.forEach(f => properties[f.name] = f);
        const destField = opts.mappedBy(properties);
        if (!destField) {
            throw new Error(`Unknown Relation Mapping for ${sourceEntity.name}.${sourceField.name}.`);
        }
        return destField;
    }
    async buildEntityLinks(sourceEntity) {
        const sourceModel = this.modelMap.get(sourceEntity.name);
        if (!sourceModel) {
            return;
        }
        for (const sourceField of sourceEntity.fields) {
            const opts = sourceField.typeOptions;
            if (opts.relation) {
                this.buildRelation(opts, sourceEntity, sourceField, sourceModel);
            }
        }
    }
    buildRelation(opts, sourceEntity, sourceField, sourceModel) {
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
    oneToOne(opts, sourceEntity, sourceField, destEntity, sourceModel, destModel) {
        const o2o = opts;
        const destField = this.resolveMappedBy(o2o, sourceEntity, sourceField, destEntity);
        if (destField.typeOptions.relation !== 'one2one') {
            throw new Error(`Invalid OneToOne Relation Spec for ${destEntity.name}.${destField.name}.`);
        }
        if (!o2o.owner && !destField.typeOptions.owner) {
            throw new Error(`Missing owner OneToOne Relation Spec for ${sourceEntity.name}.${sourceField.name} or ${destEntity.name}.${destField.name}.`);
        }
        if (o2o.owner && destField.typeOptions.owner) {
            throw new Error(`Invalid both sides owner OneToOne Relation Spec for ${sourceEntity.name}.${sourceField.name} or ${destEntity.name}.${destField.name}.`);
        }
        if (o2o.owner) {
            sourceModel.belongsTo(destModel, {
                as: sourceField.name + 'ORM',
                foreignKey: {
                    allowNull: o2o.nullable,
                    name: sourceField.name
                }
            });
        }
    }
    manyToMany(opts, sourceEntity, sourceField, destEntity, sourceModel, destModel) {
        const m2m = opts;
        const destField = this.resolveMappedBy(m2m, sourceEntity, sourceField, destEntity);
        if (destField.typeOptions.relation !== 'many2many') {
            throw new Error(`Invalid ManyToMany Relation Spec for ${destEntity.name}.${destField.name}.`);
        }
        const through = [sourceEntity, destEntity].sort((a, b) => a.name.localeCompare(b.name)).map(f => f.name).join('_to_');
        destModel.belongsToMany(sourceModel, { through, as: destField.name + 'ORM', foreignKey: sourceField.name });
    }
    manyToOne(opts, sourceEntity, sourceField, destEntity) {
        const m2o = opts;
        const destField = this.resolveMappedBy(m2o, sourceEntity, sourceField, destEntity);
        if (destField.typeOptions.relation !== 'one2many') {
            throw new Error(`Invalid OneToMany Relation Spec for ${destEntity.name}.${destField.name}.`);
        }
    }
    oneToMany(opts, sourceEntity, sourceField, destEntity, sourceModel, destModel) {
        const o2m = opts;
        const destField = this.resolveMappedBy(o2m, sourceEntity, sourceField, destEntity);
        if (destField.typeOptions.relation !== 'many2one') {
            throw new Error(`Invalid ManyToOne Relation Spec for ${destEntity.name}.${destField.name}.`);
        }
        sourceModel.hasMany(destModel, {
            type: seq.DataTypes.UUID,
            as: sourceField.name + 'ORM',
            onDelete: o2m.onDelete,
            foreignKey: destField.name
        });
        destModel.belongsTo(sourceModel, {
            type: seq.DataTypes.UUID,
            as: destField.name + 'ORM',
            foreignKey: {
                name: destField.name,
                allowNull: o2m.nullable,
            }
        });
    }
    async buildEntityModel(entity) {
        const attributes = {};
        const options = {
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
    async build() {
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
//# sourceMappingURL=schema.js.map