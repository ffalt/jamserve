"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityRepository = void 0;
class EntityRepository {
    constructor(em, entityName) {
        this.em = em;
        this.entityName = entityName;
    }
    buildOrderByFindOptions(order) {
        return;
    }
    persist(entity, flush = false) {
        return this.em.persist(this.entityName, entity, flush);
    }
    async persistAndFlush(entity) {
        await this.em.persistAndFlush(this.entityName, entity);
    }
    persistLater(entity) {
        this.em.persistLater(this.entityName, entity);
    }
    async findOne(options) {
        return this.em.findOne(this.entityName, options);
    }
    async findOneOrFail(options) {
        return this.em.findOneOrFail(this.entityName, options);
    }
    async findOneByID(id) {
        return this.em.findOneByID(this.entityName, id);
    }
    async findOneOrFailByID(id) {
        return this.em.findOneOrFailByID(this.entityName, id);
    }
    async findByIDs(ids) {
        return this.em.findByIDs(this.entityName, ids);
    }
    async findOneID(options) {
        return this.em.findOneID(this.entityName, options);
    }
    async findIDs(options) {
        return this.em.findIDs(this.entityName, options);
    }
    async find(options) {
        return this.em.find(this.entityName, options);
    }
    async all() {
        return this.em.all(this.entityName);
    }
    async findAndCount(options) {
        return this.em.findAndCount(this.entityName, options);
    }
    async removeByQueryAndFlush(options) {
        return this.em.removeByQueryAndFlush(this.entityName, options);
    }
    remove(entity, flush) {
        return this.em.remove(this.entityName, entity, flush);
    }
    async removeAndFlush(entity) {
        await this.em.removeAndFlush(this.entityName, entity);
    }
    removeLater(entity) {
        this.em.removeLater(this.entityName, entity);
    }
    async flush() {
        return this.em.flush();
    }
    create(data) {
        return this.em.create(this.entityName, data);
    }
    async count(options = {}) {
        return this.em.count(this.entityName, options);
    }
}
exports.EntityRepository = EntityRepository;
//# sourceMappingURL=repository.js.map