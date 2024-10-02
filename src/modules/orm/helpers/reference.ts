import { AnyEntity, IDEntity } from '../typings.js';
import { PropertyMetadata } from '../definitions/property-metadata.js';
import { ManagedEntity } from '../definitions/managed-entity.js';

export class Reference<T extends IDEntity<T>> {
	private initialized = false;
	private field!: PropertyMetadata;
	private obj?: T;

	constructor(private owner: AnyEntity) {
	}

	manage(field: PropertyMetadata): void {
		this.field = field;
	}

	clear(): void {
		this.obj = undefined;
		this.initialized = false;
	}

	async get(): Promise<T | undefined> {
		if (this.obj) {
			return this.obj;
		}
		if (!this.initialized) {
			const entity = this.owner as ManagedEntity;
			const id = entity._source.get(this.field.name);
			if (id && this.field.linkedEntity) {
				this.obj = await entity._em.findOneOrFailByID<T>(this.field.linkedEntity.name, id);
			}
			this.initialized = true;
		}
		return this.obj;
	}

	async set(data: T | undefined): Promise<void> {
		const entity = this.owner as ManagedEntity;
		if (data) {
			const dataEntity = data as any as ManagedEntity;
			entity._source.set(this.field.name, dataEntity.id);
			this.obj = data;
		} else {
			entity._source.set(this.field.name, null);
			this.obj = undefined;
		}
		this.initialized = true;
	}

	id(): string | undefined {
		if (this.obj) {
			return this.obj.id;
		}
		const entity = this.owner as ManagedEntity;
		return entity._source.get(this.field.name);
	}

	idOrFail(): string {
		const result = this.id();
		if (!result) {
			throw new Error(`${this.field.linkedEntity?.name} not found`);
		}
		return result;
	}

	async getOrFail(): Promise<T> {
		const result = await this.get();
		if (!result) {
			throw new Error(`${this.field.linkedEntity?.name} not found`);
		}
		return result;
	}
}
