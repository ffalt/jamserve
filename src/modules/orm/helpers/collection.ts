import {AnyEntity, IDEntity} from '../typings';
import {PropertyMetadata} from '../definitions/property-metadata';
import {ManagedEntity} from '../definitions/managed-entity';
import {Model} from 'sequelize';
import {Transaction} from 'sequelize/types/lib/transaction';

export class Collection<T extends IDEntity<T>> {
	private initialized = false;
	private field!: PropertyMetadata;
	private list?: Array<T>;
	public changeSet?: { add?: Array<T>; set?: Array<T>; remove?: Array<T> };

	constructor(private owner: AnyEntity) {
	}

	public manage(field: PropertyMetadata) {
		this.field = field;
	}

	async count(): Promise<number> {
		if (this.list) {
			return this.list.length;
		}
		const func = this.sourceFunc('count')
		return await func();
	}

	private sourceFunc(mode: string): Function {
		const entity = this.owner as ManagedEntity;
		const getFuncName = this.funcName(mode);
		let func = entity._source[getFuncName];
		func = func.bind(entity._source);
		return func;
	}


	public clear() {
		this.list = undefined;
		this.initialized = false;
		this.changeSet = undefined;
	}

	async getItems(): Promise<Array<T>> {
		if (this.list) {
			return this.list;
		}
		const entity = this.owner as ManagedEntity;
		const func = this.sourceFunc('get')
		const sources: Array<Model<T>> = await func();
		let list: Array<T> = sources.map(source => entity._em.mapEntity(this.field.linkedEntity?.name || '', source));
		if (this.changeSet) {
			if (this.changeSet.set) {
				list = this.changeSet.set as Array<any>;
			}
			if (this.changeSet.add) {
				list = list.concat(this.changeSet.add as Array<any>);
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

	async set(items: Array<T>): Promise<void> {
		this.changeSet = {set: items as Array<any>};
		if (this.list) {
			this.list = items;
		}
	}

	private funcName(mode: string, plural?: boolean): string {
		return mode + this.field.name[0].toUpperCase() + this.field.name.slice(1) + 'ORM' + (plural ? 's' : '');
	}

	async flush(transaction?: Transaction): Promise<void> {
		if (this.changeSet) {
			if (this.changeSet.set) {
				const func = this.sourceFunc('set')
				await func(this.changeSet.set.map(d => (d as any as ManagedEntity)._source), {transaction});
			}
			if (this.changeSet.add) {
				const func = this.sourceFunc('add')
				await func(this.changeSet.add.map(d => (d as any as ManagedEntity)._source), {transaction});
			}
			if (this.changeSet.remove) {
				const func = this.sourceFunc('remove')
				await func(this.changeSet.remove.map(d => (d as any as ManagedEntity)._source), {transaction});
			}
			this.changeSet = undefined;
		}
	}

	async add(item: T): Promise<void> {
		this.changeSet = this.changeSet || {};
		this.changeSet.add = this.changeSet.add || [];
		if (!this.changeSet.add.find(e => e.id === item.id)) {
			this.changeSet.add.push(item);
			if (this.list) {
				this.list.push(item);
			}
		}
	}

}
