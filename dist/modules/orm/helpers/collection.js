export class Collection {
    constructor(owner) {
        this.owner = owner;
        this.initialized = false;
    }
    manage(field) {
        this.field = field;
    }
    async count() {
        if (this.list) {
            return this.list.length;
        }
        if (this.itemCount !== undefined) {
            return this.itemCount;
        }
        const func = this.sourceFunc('count');
        const result = await func();
        this.itemCount = result;
        return result;
    }
    sourceFunc(mode) {
        const entity = this.owner;
        const getFuncName = this.funcName(mode);
        let func = entity._source[getFuncName];
        func = func.bind(entity._source);
        return func;
    }
    clear() {
        this.list = undefined;
        this.itemCount = undefined;
        this.initialized = false;
        this.changeSet = undefined;
    }
    async getIDs(options) {
        return (await this.getItems(options)).map(item => item.id);
    }
    async getItems(options) {
        if (this.list) {
            return this.list;
        }
        const entity = this.owner;
        const func = this.sourceFunc('get');
        options = options || this.getOrderOptions();
        const sources = await func(options);
        let list = sources.map(source => entity._em.mapEntity(this.field.linkedEntity?.name || '', source));
        if (this.changeSet) {
            if (this.changeSet.set) {
                list = this.changeSet.set;
            }
            if (this.changeSet.add) {
                list = list.concat(this.changeSet.add);
            }
            const removed = this.changeSet.remove;
            if (removed) {
                list = list.filter(e => removed.find(p => p.id === e.id));
            }
        }
        this.list = list;
        this.initialized = true;
        return this.list;
    }
    async set(items) {
        this.changeSet = { set: items };
        if (this.list) {
            this.list = items;
        }
    }
    funcName(mode, plural) {
        return mode + this.field.name[0].toUpperCase() + this.field.name.slice(1) + 'ORM' + (plural ? 's' : '');
    }
    async flush(transaction) {
        if (this.changeSet) {
            if (this.changeSet.set) {
                const func = this.sourceFunc('set');
                await func(this.changeSet.set.map(d => d._source), { transaction });
            }
            if (this.changeSet.add) {
                const func = this.sourceFunc('add');
                await func(this.changeSet.add.map(d => d._source), { transaction });
            }
            if (this.changeSet.remove) {
                const func = this.sourceFunc('remove');
                await func(this.changeSet.remove.map(d => d._source), { transaction });
            }
            this.changeSet = undefined;
        }
    }
    async add(item) {
        this.changeSet = this.changeSet || {};
        this.changeSet.add = this.changeSet.add || [];
        if (!this.changeSet.add.find(e => e.id === item.id)) {
            this.changeSet.add.push(item);
            if (this.list) {
                this.list.push(item);
            }
        }
    }
    getOrderOptions() {
        const order = this.field.typeOptions.order;
        if (order && this.field.linkedEntity) {
            return this.owner._em.getOrderFindOptions(this.field.linkedEntity.name, order);
        }
        return;
    }
}
//# sourceMappingURL=collection.js.map