import { EntityRepository } from './repository.js';
import { cleanManagedEntityRelations, createManagedEntity, mapManagedToSource, saveManagedEntityRelations } from './entity.js';
import { v4 } from 'uuid';
export class EntityCache {
    constructor() {
        this.cache = new Map();
    }
    get(entityName, id) {
        return this.cache.get(`${entityName}${id}`);
    }
    set(entityName, entity) {
        this.cache.set(`${entityName}${entity.id}`, entity);
    }
    remove(entityName, entity) {
        this.cache.delete(`${entityName}${entity.id}`);
    }
    clear() {
        this.cache = new Map();
    }
    removePrefixed(entityName) {
        const keys = this.cache.keys();
        for (const key of keys) {
            if (key.startsWith(entityName)) {
                this.cache.delete(key);
            }
        }
    }
}
export class EntityManager {
    constructor(sequelize, metadata, config, parent, useCache) {
        this.sequelize = sequelize;
        this.metadata = metadata;
        this.config = config;
        this.parent = parent;
        this.useCache = useCache;
        this.repositoryMap = {};
        this.changeSet = [];
    }
    get dialect() {
        return this.sequelize.getDialect();
    }
    getRepository(entityName) {
        entityName = typeof entityName === 'string' ? entityName : entityName.name;
        if (!this.repositoryMap[entityName]) {
            if (this.config.repositories[entityName]) {
                const RepositoryClass = this.config.repositories[entityName];
                this.repositoryMap[entityName] = new RepositoryClass(this, entityName);
            }
            else {
                this.repositoryMap[entityName] = new EntityRepository(this, entityName);
            }
        }
        return this.repositoryMap[entityName];
    }
    persistAndFlush(entityName, entity) {
        this.persistLater(entityName, entity);
        return this.flush();
    }
    persistLater(entityName, entity) {
        let entities = Array.isArray(entity) ? entity : [entity];
        entities = entities.filter(e => !this.changeSet.find(c => c.persist === e));
        this.changeSet.push(...(entities.map(e => ({ entityName: entityName, persist: e }))));
    }
    async flush() {
        if (this.changeSet.length === 0) {
            return;
        }
        const t = await this.sequelize.transaction();
        try {
            for (const change of this.changeSet) {
                if (change.persist) {
                    mapManagedToSource(change.persist);
                    await change.persist._source.save({ transaction: t });
                }
                else if (change.remove && change.remove.entity) {
                    await change.remove.entity._source.destroy({ transaction: t });
                    this.parent.cache.remove(change.entityName, change.remove.entity);
                }
                else if (change.remove && change.remove.query) {
                    const model = this.model(change.entityName);
                    change.remove.resultCount = await model.destroy({ where: change.remove.query.where, transaction: t });
                    this.parent.cache.removePrefixed(change.entityName);
                }
            }
            for (const change of this.changeSet) {
                if (change.persist) {
                    await saveManagedEntityRelations(change.persist, t);
                }
            }
            for (const change of this.changeSet) {
                if (change.persist) {
                    cleanManagedEntityRelations(change.persist);
                    this.parent.cache.remove(change.entityName, change.persist);
                }
            }
            this.changeSet = [];
            await t.commit();
        }
        catch (error) {
            await t.rollback();
            throw error;
        }
    }
    persist(entityName, entity, flush = false) {
        if (flush) {
            return this.persistAndFlush(entityName, entity);
        }
        else {
            this.persistLater(entityName, entity);
        }
    }
    async fromCacheOrLoad(entityName, ids) {
        const toLoadIDs = [];
        const fromCache = [];
        for (const id of ids) {
            const c = this.parent.cache.get(entityName, id);
            if (c) {
                fromCache.push(c);
            }
            else {
                toLoadIDs.push(id);
            }
        }
        if (toLoadIDs.length === 0) {
            return fromCache;
        }
        const model = this.model(entityName);
        const loadedSources = await model.findAll({ where: { id: toLoadIDs } });
        const loaded = loadedSources.map(source => this.mapEntity(entityName, source));
        for (const item of loaded) {
            this.parent.cache.set(entityName, item);
        }
        return loaded.concat(fromCache).sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));
    }
    async findOne(entityName, options) {
        if (this.useCache) {
            const id = await this.findOneID(entityName, options);
            if (!id) {
                return;
            }
            const cached = this.parent.cache.get(entityName, id);
            if (cached) {
                return cached;
            }
        }
        const model = this.model(entityName);
        const source = await model.findOne(options);
        if (!source) {
            return;
        }
        const result = this.mapEntity(entityName, source);
        if (this.useCache) {
            this.parent.cache.set(entityName, result);
        }
        return result;
    }
    async findOneByID(entityName, id) {
        if (!id || id.trim().length === 0) {
            return Promise.reject(Error('Invalid ID'));
        }
        if (this.useCache) {
            const cached = this.parent.cache.get(entityName, id);
            if (cached) {
                return cached;
            }
        }
        const model = this.model(entityName);
        const source = await model.findOne({ where: { id } });
        if (!source) {
            return;
        }
        const result = this.mapEntity(entityName, source);
        if (this.useCache) {
            this.parent.cache.set(entityName, result);
        }
        return result;
    }
    async find(entityName, options) {
        if (this.useCache) {
            const ids = await this.findIDs(entityName, options);
            return await this.fromCacheOrLoad(entityName, ids);
        }
        const model = this.model(entityName);
        const rows = await model.findAll(options);
        return rows.map(source => this.mapEntity(entityName, source));
    }
    async findAndCount(entityName, options) {
        if (this.useCache) {
            const { count, ids } = await this.findIDsAndCount(entityName, options);
            const entities = await this.fromCacheOrLoad(entityName, ids);
            return { count, entities };
        }
        const model = this.model(entityName);
        const { count, rows } = await model.findAndCountAll(options);
        return { count, entities: rows.map(source => this.mapEntity(entityName, source)) };
    }
    async all(entityName) {
        return this.find(entityName, {});
    }
    async findOneOrFail(entityName, options) {
        const result = await this.findOne(entityName, options);
        if (!result) {
            throw new Error(`${entityName} not found`);
        }
        return result;
    }
    async findOneOrFailByID(entityName, id) {
        const result = await this.findOneByID(entityName, id);
        if (!result) {
            throw new Error(`${entityName} not found`);
        }
        return result;
    }
    findByIDs(entityName, ids) {
        return this.find(entityName, { where: { id: ids } });
    }
    async findOneID(entityName, options) {
        const model = this.model(entityName);
        const opts = { ...options, raw: true, attributes: ['id'] };
        const result = await model.findOne(opts);
        return result?.id;
    }
    async findIDs(entityName, options) {
        const model = this.model(entityName);
        const opts = { ...options, raw: true, attributes: ['id'] };
        const result = await model.findAll(opts);
        return result.map(o => o.id);
    }
    async findIDsAndCount(entityName, options) {
        const model = this.model(entityName);
        const opts = { ...options, raw: true, attributes: ['id'] };
        const { count, rows } = await model.findAndCountAll(opts);
        return { count, ids: rows.map(o => o.id) };
    }
    async count(entityName, options = {}) {
        return await this.model(entityName).count(options);
    }
    model(entityName) {
        return this.sequelize.model(entityName);
    }
    mapEntity(entityName, source) {
        const meta = this.metadata.entities.find(e => e.name === entityName);
        if (!meta) {
            throw Error('Invalid ORM setup');
        }
        return createManagedEntity(meta, source, this);
    }
    create(entityName, data) {
        const idData = { id: v4(), createdAt: new Date(), updatedAt: new Date(), ...data };
        const _source = this.model(entityName).build(idData);
        const entity = this.mapEntity(entityName, _source);
        Object.keys(idData).forEach(key => entity[key] = idData[key]);
        return entity;
    }
    remove(entityName, entity, flush) {
        if (flush) {
            return this.removeAndFlush(entityName, entity);
        }
        else {
            this.removeLater(entityName, entity);
        }
    }
    async removeAndFlush(entityName, entity) {
        this.removeLater(entityName, entity);
        await this.flush();
    }
    removeLater(entityName, entity) {
        const entities = Array.isArray(entity) ? entity : [entity];
        this.changeSet.push(...(entities.map(e => ({ entityName: entityName, remove: { entity: e } }))));
    }
    async removeByQueryAndFlush(entityName, options) {
        const change = { entityName: entityName, remove: { query: options, resultCount: 0 } };
        this.changeSet.push(change);
        await this.flush();
        return change.remove.resultCount;
    }
    hasChanges() {
        return this.changeSet.length > 0;
    }
    changesCount() {
        return this.changeSet.length;
    }
    getOrderFindOptions(entityName, order) {
        const repo = this.getRepository(entityName);
        if (repo) {
            return repo.buildOrderByFindOptions(order);
        }
        return;
    }
}
//# sourceMappingURL=manager.js.map