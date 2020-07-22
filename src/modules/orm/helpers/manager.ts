import {AnyEntity, Dictionary, EntityData, EntityName, IDEntity} from '../typings';
import {EntityRepository} from './repository';
import {MetadataStorage} from '../metadata/metadata-storage';
import {ORMConfig} from '../definitions/config';
import {FindOptions, Sequelize} from 'sequelize';
import {Model, ModelCtor} from 'sequelize/types/lib/model';
import {ManagedEntity} from '../definitions/managed-entity';
import {cleanManagedEntityRelations, createManagedEntity, saveManagedEntity, saveManagedEntityRelations} from './entity';

export class EntityManager {
	private readonly repositoryMap: Dictionary<EntityRepository<IDEntity>> = {};
	private changeSet: Array<{ entityName: EntityName<any>; persist?: AnyEntity | AnyEntity[]; remove?: { entity?: AnyEntity | AnyEntity[]; query?: FindOptions; resultCount?: number } }> = [];

	constructor(public readonly sequelize: Sequelize, private readonly metadata: MetadataStorage, private readonly config: ORMConfig) {
	}

	getRepository<T extends IDEntity<T>, U extends EntityRepository<T> = EntityRepository<T>>(entityName: EntityName<T>): U {
		entityName = typeof entityName === 'string' ? entityName : entityName.name;
		if (!this.repositoryMap[entityName]) {
			if (this.config.repositories[entityName]) {
				const RepositoryClass = this.config.repositories[entityName];
				this.repositoryMap[entityName] = new RepositoryClass(this, entityName) as EntityRepository<IDEntity>;
			} else {
				this.repositoryMap[entityName] = new EntityRepository<IDEntity>(this, entityName);
			}
		}

		return this.repositoryMap[entityName] as unknown as U;
	}

	persistAndFlush<T extends AnyEntity<T>>(entityName: EntityName<T>, entity: AnyEntity | AnyEntity[]): Promise<void> {
		this.persistLater(entityName, entity);
		return this.flush();
	}

	persistLater<T extends AnyEntity<T>>(entityName: EntityName<T>, entity: AnyEntity | AnyEntity[]): void {
		this.changeSet.push({entityName, persist: entity})
	}

	private async flushEntityChange<T extends AnyEntity<T>>(entityName: EntityName<T>, entity: AnyEntity | AnyEntity[]) {
		const items = Array.isArray(entity) ? entity : [entity];
		for (const item of items) {
			await saveManagedEntity(item as ManagedEntity)
		}
	}

	private async flushEntityRelationChange<T extends AnyEntity<T>>(entityName: EntityName<T>, entity: AnyEntity | AnyEntity[]) {
		const items = Array.isArray(entity) ? entity : [entity];
		for (const item of items) {
			await saveManagedEntityRelations(item as ManagedEntity)
		}
	}

	private async flushRemove<T extends AnyEntity<T>>(entityName: EntityName<T>, entity: AnyEntity | AnyEntity[]): Promise<void> {
		const items = Array.isArray(entity) ? entity : [entity];
		for (const item of items) {
			const instance = item as ManagedEntity;
			await instance._source.destroy();
		}
	}

	private async flushRemoveQuery<T extends AnyEntity<T>>(entityName: EntityName<T>, options: FindOptions<T>): Promise<number> {
		const model = this.model(entityName);
		return await model.destroy({where: options.where});
	}

	async flush(): Promise<void> {
		if (this.changeSet.length === 0) {
			return;
		}
		const t = await this.sequelize.transaction();
		try {
			for (const change of this.changeSet) {
				if (change.persist) {
					await this.flushEntityChange(change.entityName, change.persist);
				} else if (change.remove && change.remove.entity) {
					await this.flushRemove(change.entityName, change.remove.entity);
				} else if (change.remove && change.remove.query) {
					change.remove.resultCount = await this.flushRemoveQuery(change.entityName, change.remove.query);
				}
			}
			for (const change of this.changeSet) {
				if (change.persist) {
					await this.flushEntityRelationChange(change.entityName, change.persist);
				}
			}
			for (const change of this.changeSet) {
				if (change.persist) {
					cleanManagedEntityRelations(change.persist as ManagedEntity);
				}
			}
			this.changeSet = [];
			await t.commit();
		} catch (error) {
			await t.rollback();
			throw error;
		}
	}

	persist<T extends AnyEntity<T>>(entityName: EntityName<T>, entity: AnyEntity | AnyEntity[], flush = false): void | Promise<void> {
		if (flush) {
			return this.persistAndFlush(entityName, entity);
		} else {
			this.persistLater(entityName, entity);
		}
	}

	async findOne<T extends AnyEntity<T>>(entityName: EntityName<T>, options: FindOptions<T>): Promise<T | undefined> {
		const model = this.model(entityName);
		const source = await model.findOne(options);
		if (!source) {
			return;
		}
		return this.mapEntity(entityName, source);
	}

	async findOneByID<T extends AnyEntity<T>>(entityName: EntityName<T>, id: string): Promise<T | undefined> {
		if (!id || id.trim().length === 0) {
			return Promise.reject(Error('Invalid ID'));
		}
		const model = this.model(entityName);
		await this.sequelize.authenticate();
		const source = await model.findOne({where: {id}});
		// const source = await model.findByPk(id);
		if (!source) {
			return;
		}
		return this.mapEntity(entityName, source);
	}

	async findOneOrFail<T extends AnyEntity<T>>(entityName: EntityName<T>, options: FindOptions<T>): Promise<T> {
		const result = await this.findOne<T>(entityName, options);
		if (!result) {
			throw new Error(`${entityName} not found`);
		}
		return result;
	}

	async findOneOrFailByID<T extends IDEntity<T>>(entityName: EntityName<T>, id: string): Promise<T> {
		const result = await this.findOneByID<T>(entityName, id);
		if (!result) {
			throw new Error(`${entityName} not found`);
		}
		return result;
	}

	async all<T extends AnyEntity<T>>(entityName: EntityName<T>): Promise<T[]> {
		return this.find(entityName, {});
	}

	public findByIDs<T>(entityName: EntityName<T>, ids: Array<string>): Promise<T[]> {
		return this.find(entityName, {where: {id: ids} as any});
	}

	async find<T extends AnyEntity<T>>(entityName: EntityName<T>, options: FindOptions<T>): Promise<T[]> {
		const model = this.model(entityName);
		const rows = await model.findAll(options);
		return rows.map(source => this.mapEntity(entityName, source));
	}

	async findOneID<T extends AnyEntity<T>>(entityName: EntityName<T>, options: FindOptions<T>): Promise<string | undefined> {
		const model = this.model(entityName);
		options.attributes = ['id'];
		const result = await model.findOne<any>(options);
		if (result) {
			return result.id;
		}
	}

	async findIDs<T extends AnyEntity<T>>(entityName: EntityName<T>, options: FindOptions<T>): Promise<string[]> {
		const model = this.model(entityName);
		options.attributes = ['id'];
		const result = await model.findAll<any>(options);
		return result.map((o: { id: string }) => o.id)
	}

	async findAndCount<T extends AnyEntity<T>>(entityName: EntityName<T>, options: FindOptions<T>): Promise<{ count: number; entities: T[] }> {
		const model = this.model(entityName);
		const {count, rows} = await model.findAndCountAll(options);
		return {count, entities: rows.map(source => this.mapEntity(entityName, source))};
	}

	async count<T extends AnyEntity<T>>(entityName: EntityName<T>, options: FindOptions<T> = {}): Promise<number> {
		return await this.model(entityName).count(options);
	}

	model<T>(entityName: EntityName<T>): ModelCtor<Model> {
		return this.sequelize.model(entityName as string);
	}

	mapEntity<T extends AnyEntity<T>>(entityName: EntityName<T>, source: Model<T>): T {
		const meta = this.metadata.entities.find(e => e.name === entityName);
		if (!meta) {
			throw Error('Invalid ORM setup');
		}
		return createManagedEntity<T>(meta, source, this);
	}

	create<T extends AnyEntity<T>>(entityName: EntityName<T>, data: EntityData<T>): T {
		const _source = this.model<T>(entityName).build(data);
		const entity = this.mapEntity(entityName, _source);
		Object.keys(data).forEach(key => (entity as any)[key] = data[key]);
		return entity;
	}

	remove<T extends AnyEntity<T>>(entityName: EntityName<T>, entity: AnyEntity, flush: boolean): void | Promise<void> {
		if (flush) {
			return this.removeAndFlush(entityName, entity);
		} else {
			this.removeLater(entityName, entity);
		}
	}

	async removeAndFlush<T extends AnyEntity<T>>(entityName: EntityName<T>, entity: AnyEntity): Promise<void> {
		this.removeLater(entityName, entity);
		await this.flush();
	}

	removeLater<T extends AnyEntity<T>>(entityName: EntityName<T>, entity: AnyEntity): void {
		this.changeSet.push({entityName, remove: {entity}});
	}

	async removeByQueryAndFlush<T extends AnyEntity<T>>(entityName: EntityName<T>, options: FindOptions<T>): Promise<number> {
		const change = {entityName, remove: {query: options, resultCount: 0}};
		this.changeSet.push(change);
		await this.flush();
		return change.remove.resultCount;
	}
}
