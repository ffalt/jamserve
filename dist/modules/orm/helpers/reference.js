"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reference = void 0;
class Reference {
    constructor(owner) {
        this.owner = owner;
        this.initialized = false;
    }
    manage(field) {
        this.field = field;
    }
    clear() {
        this.obj = undefined;
        this.initialized = false;
    }
    async get() {
        if (this.obj) {
            return this.obj;
        }
        if (!this.initialized) {
            const entity = this.owner;
            const id = entity._source.get(this.field.name);
            if (id && this.field.linkedEntity) {
                this.obj = await entity._em.findOneOrFailByID(this.field.linkedEntity.name, id);
            }
            this.initialized = true;
        }
        return this.obj;
    }
    async set(data) {
        const entity = this.owner;
        if (data) {
            const dataEntity = data;
            entity._source.set(this.field.name, dataEntity.id);
            this.obj = data;
        }
        else {
            entity._source.set(this.field.name, null);
            this.obj = undefined;
        }
        this.initialized = true;
    }
    id() {
        if (this.obj) {
            return this.obj.id;
        }
        const entity = this.owner;
        return entity._source.get(this.field.name);
    }
    idOrFail() {
        var _a;
        const result = this.id();
        if (!result) {
            throw new Error(`${(_a = this.field.linkedEntity) === null || _a === void 0 ? void 0 : _a.name} not found`);
        }
        return result;
    }
    async getOrFail() {
        var _a;
        const result = await this.get();
        if (!result) {
            throw new Error(`${(_a = this.field.linkedEntity) === null || _a === void 0 ? void 0 : _a.name} not found`);
        }
        return result;
    }
}
exports.Reference = Reference;
//# sourceMappingURL=reference.js.map