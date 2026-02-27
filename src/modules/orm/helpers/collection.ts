import { AnyEntity, IDEntity } from '../typings.js';
import { PropertyMetadata } from '../definitions/property-metadata.js';
import { ManagedEntity } from '../definitions/managed-entity.js';
import { Model, Transaction, FindOptions } from 'sequelize';
import { OrderByOptions } from '../definitions/types.js';
import { capitalize } from '../../../utils/capitalize.js';

export class Collection<T extends IDEntity<T>> {
	private field!: PropertyMetadata;
	private list?: Array<T>;
	private itemCount?: number;
	public changeSet?: { add?: Array<T>; set?: Array<T>; remove?: Array<T> };

	constructor(private readonly owner: AnyEntity) {
	}

	manage(field: PropertyMetadata): void {
		this.field = field;
	}

	async count(): Promise<number> {
		if (this.list) {
			return this.list.length;
		}
		if (this.itemCount !== undefined) {
			return this.itemCount;
		}
		const sourceFunction = this.getSourceFunction('count');
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call
		const result: number = await sourceFunction();
		this.itemCount = result;
		return result;
	}

	private getSourceFunction(mode: string): Function {
		const entity = this.owner as ManagedEntity;
		const functionName = this.getFuncName(mode);
		let sourceFunction: Function = entity._source[functionName];
		sourceFunction = sourceFunction.bind(entity._source);
		return sourceFunction;
	}

	clear(): void {
		this.list = undefined;
		this.itemCount = undefined;
		this.changeSet = undefined;
	}

	async getIDs(options?: FindOptions<T>): Promise<Array<string>> {
		const list = await this.getItems(options);
		return list.map(item => item.id);
	}

	async getItems(options?: FindOptions<IDEntity<T>>): Promise<Array<T>> {
		if (this.list) {
			return this.list;
		}
		const entity = this.owner as ManagedEntity;
		const sourceFunction = this.getSourceFunction('get');
		options = options ?? this.getOrderOptions();
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call
		const sources: Array<Model<T>> = await sourceFunction(options);
		let list: Array<T> = sources.map(source => entity._em.mapEntity(this.field.linkedEntity?.name ?? '', source));
		if (this.changeSet) {
			if (this.changeSet.set) {
				list = this.changeSet.set as Array<any>;
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

	async set(items: Array<T>): Promise<void> {
		this.changeSet = { set: items as Array<any> };
		if (this.list) {
			this.list = items;
		}
	}

	private getFuncName(mode: string, plural?: boolean): string {
		return `${mode}${capitalize(this.field.name)}ORM${plural ? 's' : ''}`;
	}

	async flush(transaction?: Transaction): Promise<void> {
		if (this.changeSet) {
			if (this.changeSet.set) {
				const sourceFunction = this.getSourceFunction('set');
				// eslint-disable-next-line @typescript-eslint/no-unsafe-call
				await sourceFunction(this.changeSet.set.map(d => (d as any as ManagedEntity)._source), { transaction });
			}
			if (this.changeSet.add) {
				const sourceFunction = this.getSourceFunction('add');
				// eslint-disable-next-line @typescript-eslint/no-unsafe-call
				await sourceFunction(this.changeSet.add.map(d => (d as any as ManagedEntity)._source), { transaction });
			}
			if (this.changeSet.remove) {
				const sourceFunction = this.getSourceFunction('remove');
				// eslint-disable-next-line @typescript-eslint/no-unsafe-call
				await sourceFunction(this.changeSet.remove.map(d => (d as any as ManagedEntity)._source), { transaction });
			}
			this.changeSet = undefined;
		}
	}

	async add(item: T): Promise<void> {
		this.changeSet = this.changeSet ?? {};
		this.changeSet.add = this.changeSet.add ?? [];
		if (!this.changeSet.add.some(entry => entry.id === item.id)) {
			this.changeSet.add.push(item);
			if (this.list) {
				this.list.push(item);
			}
		}
	}

	private getOrderOptions(): FindOptions<IDEntity<T>> | undefined {
		const order = (this.field.typeOptions as OrderByOptions).order;
		if (order && this.field.linkedEntity) {
			return (this.owner as ManagedEntity)._em.getOrderFindOptions(this.field.linkedEntity.name, order);
		}
		return;
	}
}
