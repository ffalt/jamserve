import {AnyEntity, IDEntity} from '../typings';
import {PropertyMetadata} from '../definitions/property-metadata';
import {ManagedEntity} from '../definitions/managed-entity';
import {Model} from 'sequelize';

export class Collection<T extends IDEntity<T>> {
	private initialized = false;
	private field!: PropertyMetadata;
	private list?: Array<T>;
	public changeSet?: Array<{ add?: T; set?: Array<T>, remove?: T }>;

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
		let list = sources.map(source => entity._em.mapEntity(this.field.linkedEntity?.name || '', source));
		if (this.changeSet && this.changeSet.length > 0) {
			for (const change of this.changeSet) {
				if (change.add) {
					list.push(change.add);
				} else if (change.set) {
					list = change.set;
				}
			}
		}
		this.list = list;
		this.initialized = true;
		return this.list;
	}

	async set(items: Array<T>): Promise<void> {
		this.changeSet = this.changeSet || [];
		this.changeSet.push({set: items});
		if (this.list) {
			this.list = items;
		}
	}

	private funcName(mode: string): string {
		return mode + this.field.name[0].toUpperCase() + this.field.name.slice(1) + 'ORM';
	}

	async flush(): Promise<void> {
		if (this.changeSet) {
			for (const change of this.changeSet) {
				if (change.add) {
					const func = this.sourceFunc('add')
					const dataEntity = change.add as any as ManagedEntity;
					await func(dataEntity._source);
				} else if (change.set) {
					const func = this.sourceFunc('set')
					const dataEntities = change.set as any as Array<ManagedEntity>;
					await func(dataEntities.map(d => d._source));
				}
			}
			this.changeSet = undefined;
		}
	}

	async add(item: T): Promise<void> {
		this.changeSet = this.changeSet || [];
		this.changeSet.push({add: item});
		if (this.list) {
			this.list.push(item);
		}
	}

}
