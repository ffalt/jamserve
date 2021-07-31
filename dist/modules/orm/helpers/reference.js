export class Reference {
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
        const result = this.id();
        if (!result) {
            throw new Error(`${this.field.linkedEntity?.name} not found`);
        }
        return result;
    }
    async getOrFail() {
        const result = await this.get();
        if (!result) {
            throw new Error(`${this.field.linkedEntity?.name} not found`);
        }
        return result;
    }
}
//# sourceMappingURL=reference.js.map