"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelBuilder = exports.DBModel = void 0;
const sequelize_1 = require("sequelize");
const __1 = require("..");
class DBModel {
}
exports.DBModel = DBModel;
class ModelBuilder {
    constructor(sequelize, metadata) {
        this.sequelize = sequelize;
        this.metadata = metadata;
        this.modelMap = new Map();
    }
    async buildColumnAttributeModel(field, entity) {
        const type = field.getType();
        const opts = field.typeOptions;
        const allowNull = opts.nullable === true;
        if (type === __1.ORM_ID && opts.primaryKey) {
            return {
                type: sequelize_1.DataTypes.UUIDV4,
                allowNull: false,
                unique: true,
                primaryKey: true
            };
        }
        if (type === __1.ORM_ID) {
            return { type: sequelize_1.DataTypes.UUIDV4, allowNull };
        }
        if (type === Boolean) {
            return { type: sequelize_1.DataTypes.BOOLEAN, allowNull };
        }
        if (type === __1.ORM_INT) {
            return { type: sequelize_1.DataTypes.INTEGER, allowNull };
        }
        if (type === __1.ORM_TIMESTAMP) {
            return { type: sequelize_1.DataTypes.TIME, allowNull };
        }
        if (type === __1.ORM_FLOAT || type === Number) {
            return { type: sequelize_1.DataTypes.FLOAT, allowNull };
        }
        if (type === String) {
            return {
                type: sequelize_1.DataTypes.TEXT,
                allowNull
            };
        }
        const enumInfo = this.metadata.enums.find(e => e.enumObj === type);
        if (enumInfo) {
            return {
                type: sequelize_1.DataTypes.TEXT,
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
            const relation = opts.relation;
            if (relation) {
                const type = sourceField.getType();
                const destEntity = this.metadata.entities.find(it => it.target === type);
                if (destEntity) {
                    const destModel = this.modelMap.get(destEntity.name);
                    if (destModel) {
                        switch (relation) {
                            case 'one2many': {
                                const o2m = opts;
                                const destField = this.resolveMappedBy(o2m, sourceEntity, sourceField, destEntity);
                                if (destField.typeOptions.relation !== 'many2one') {
                                    throw new Error(`Invalid ManyToOne Relation Spec for ${destEntity.name}.${destField.name}.`);
                                }
                                sourceModel.hasMany(destModel, {
                                    type: sequelize_1.DataTypes.UUIDV4,
                                    as: sourceField.name + 'ORM',
                                    onDelete: o2m.onDelete,
                                    foreignKey: destField.name
                                });
                                destModel.belongsTo(sourceModel, {
                                    type: sequelize_1.DataTypes.UUIDV4,
                                    as: destField.name + 'ORM',
                                    foreignKey: {
                                        name: destField.name,
                                        allowNull: o2m.nullable,
                                    }
                                });
                                break;
                            }
                            case 'many2one': {
                                const m2o = opts;
                                const destField = this.resolveMappedBy(m2o, sourceEntity, sourceField, destEntity);
                                if (destField.typeOptions.relation !== 'one2many') {
                                    throw new Error(`Invalid OneToMany Relation Spec for ${destEntity.name}.${destField.name}.`);
                                }
                                break;
                            }
                            case 'many2many': {
                                const m2m = opts;
                                const destField = this.resolveMappedBy(m2m, sourceEntity, sourceField, destEntity);
                                if (destField.typeOptions.relation !== 'many2many') {
                                    throw new Error(`Invalid ManyToMany Relation Spec for ${destEntity.name}.${destField.name}.`);
                                }
                                const through = [sourceEntity, destEntity].sort((a, b) => a.name.localeCompare(b.name)).map(f => f.name).join('_to_');
                                destModel.belongsToMany(sourceModel, { through, as: destField.name + 'ORM', foreignKey: sourceField.name });
                                break;
                            }
                            case 'one2one': {
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
                                            name: sourceField.name,
                                        }
                                    });
                                    destModel.hasOne(sourceModel, {
                                        as: destField.name + 'ORM'
                                    });
                                }
                                break;
                            }
                        }
                    }
                }
            }
        }
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
exports.ModelBuilder = ModelBuilder;
//# sourceMappingURL=schema.js.map