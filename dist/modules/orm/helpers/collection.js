import { capitalize } from '../../../utils/capitalize.js';
export class Collection {
    constructor(owner) {
        this.owner = owner;
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
        const sourceFunction = this.getSourceFunction('count');
        const result = await sourceFunction();
        this.itemCount = result;
        return result;
    }
    getSourceFunction(mode) {
        const entity = this.owner;
        const functionName = this.getFuncName(mode);
        let sourceFunction = entity._source[functionName];
        sourceFunction = sourceFunction.bind(entity._source);
        return sourceFunction;
    }
    clear() {
        this.list = undefined;
        this.itemCount = undefined;
        this.changeSet = undefined;
    }
    async getIDs(options) {
        const list = await this.getItems(options);
        return list.map(item => item.id);
    }
    async getItems(options) {
        if (this.list) {
            return this.list;
        }
        const entity = this.owner;
        const sourceFunction = this.getSourceFunction('get');
        options = options ?? this.getOrderOptions();
        const sources = await sourceFunction(options);
        let list = sources.map(source => entity._em.mapEntity(this.field.linkedEntity?.name ?? '', source));
        if (this.changeSet) {
            if (this.changeSet.set) {
                list = this.changeSet.set;
            }
            if (this.changeSet.add) {
                list = [...list, ...this.changeSet.add];
            }
            const removed = this.changeSet.remove;
            if (removed) {
                list = list.filter(item => !removed.some(p => p.id === item.id));
            }
        }
        this.list = list;
        return this.list;
    }
    async set(items) {
        this.changeSet = { set: items };
        if (this.list) {
            this.list = items;
        }
    }
    getFuncName(mode, plural) {
        return `${mode}${capitalize(this.field.name)}ORM${plural ? 's' : ''}`;
    }
    async flush(transaction) {
        if (this.changeSet) {
            if (this.changeSet.set) {
                const sourceFunction = this.getSourceFunction('set');
                await sourceFunction(this.changeSet.set.map(d => d._source), { transaction });
            }
            if (this.changeSet.add) {
                const sourceFunction = this.getSourceFunction('add');
                await sourceFunction(this.changeSet.add.map(d => d._source), { transaction });
            }
            if (this.changeSet.remove) {
                const sourceFunction = this.getSourceFunction('remove');
                await sourceFunction(this.changeSet.remove.map(d => d._source), { transaction });
            }
            this.changeSet = undefined;
        }
    }
    async add(item) {
        this.changeSet = this.changeSet ?? {};
        this.changeSet.add = this.changeSet.add ?? [];
        if (!this.changeSet.add.some(entry => entry.id === item.id)) {
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