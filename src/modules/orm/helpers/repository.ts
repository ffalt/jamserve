import { EntityManager } from './manager.js';
import { EntityData, EntityName, IDEntity } from '../typings.js';
import { FindOptions } from 'sequelize';

export class EntityRepository<Entity extends IDEntity<Entity>> {
	constructor(protected readonly em: EntityManager, protected readonly entityName: EntityName<Entity>) {
	}

	buildOrderByFindOptions(_order?: Array<{ orderBy: any; orderDesc?: boolean }>): FindOptions<Entity> | undefined {
		// to be overwritten
		return;
	}

	async persistAndFlush(entity: Entity | Array<Entity>): Promise<void> {
		await this.em.persistAndFlush(this.entityName, entity);
	}

	persistLater(entity: Entity | Array<Entity>): void {
		this.em.persistLater(this.entityName, entity);
	}

	async findOne(options: FindOptions<Entity>): Promise<Entity | undefined> {
		return this.em.findOne<Entity>(this.entityName, options);
	}

	async findOneOrFail(options: FindOptions<Entity>): Promise<Entity> {
		return this.em.findOneOrFail<Entity>(this.entityName, options);
	}

	async findOneByID(id: string): Promise<Entity | undefined> {
		return this.em.findOneByID<Entity>(this.entityName, id);
	}

	async findOneOrFailByID(id: string): Promise<Entity> {
		return this.em.findOneOrFailByID<Entity>(this.entityName, id);
	}

	async findByIDs(ids: Array<string>): Promise<Array<Entity>> {
		return this.em.findByIDs<Entity>(this.entityName, ids);
	}

	async findOneID(options: FindOptions<Entity>): Promise<string | undefined> {
		return this.em.findOneID<Entity>(this.entityName, options);
	}

	async findIDs(options: FindOptions<Entity>): Promise<Array<string>> {
		return this.em.findIDs<Entity>(this.entityName, options);
	}

	async find(options: FindOptions<Entity>): Promise<Array<Entity>> {
		// eslint-disable-next-line unicorn/no-array-callback-reference, unicorn/no-array-method-this-argument
		return this.em.find<Entity>(this.entityName, options);
	}

	async all(): Promise<Array<Entity>> {
		return this.em.all<Entity>(this.entityName);
	}

	async findAndCount(options: FindOptions<Entity>): Promise<{ entities: Array<Entity>; count: number }> {
		return this.em.findAndCount<Entity>(this.entityName, options);
	}

	async removeByQueryAndFlush(options: FindOptions<Entity>): Promise<number> {
		return this.em.removeByQueryAndFlush(this.entityName, options);
	}

	async removeAndFlush(entity: Entity): Promise<void> {
		await this.em.removeAndFlush(this.entityName, entity);
	}

	removeLater(entity: Entity): void {
		this.em.removeLater(this.entityName, entity);
	}

	removeListLater(entities: Array<Entity>): void {
		this.em.removeLater(this.entityName, entities);
	}

	async flush(): Promise<void> {
		return this.em.flush();
	}

	create(data: EntityData<Entity>): Entity {
		return this.em.create<Entity>(this.entityName, data);
	}

	async count(options: FindOptions<Entity> = {}): Promise<number> {
		return this.em.count<Entity>(this.entityName, options);
	}
}
