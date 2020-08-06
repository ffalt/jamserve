import {AnyEntity, Dictionary, EntityData, EntityName, IDEntity} from '../typings';
import {EntityRepository} from './repository';
import {MetadataStorage} from '../metadata/metadata-storage';
import {ORMConfig} from '../definitions/config';
import {FindOptions, Sequelize} from 'sequelize';
import {Model, ModelCtor} from 'sequelize/types/lib/model';
import {ManagedEntity} from '../definitions/managed-entity';
import {cleanManagedEntityRelations, createManagedEntity, mapManagedToSource, saveManagedEntityRelations} from './entity';
import {v4} from 'uuid';
import {ORM} from './orm';

export class EntityCache {
	private cache = new Map<string, IDEntity>();

	get<T>(entityName: EntityName<T>, id: string): IDEntity | undefined {
		return this.cache.get(`${entityName}${id}`);
	}

	set<T>(entityName: EntityName<T>, entity: IDEntity): void {
		this.cache.set(`${entityName}${entity.id}`, entity);
	}

	remove<T>(entityName: EntityName<T>, entity: IDEntity): void {
		this.cache.delete(`${entityName}${entity.id}`);
	}

	clear() {
		this.cache = new Map();
	}

	removePrefixed(entityName: string) {
		const keys = this.cache.keys();
		for (const key of keys) {
			if (key.startsWith(entityName)) {
				this.cache.delete(key);
			}
		}
	}
}

export class EntityManager {
	private readonly repositoryMap: Dictionary<EntityRepository<IDEntity>> = {};
	private changeSet: Array<{ entityName: string; persist?: ManagedEntity; remove?: { entity?: ManagedEntity; query?: FindOptions; resultCount?: number } }> = [];

	constructor(
		public readonly sequelize: Sequelize,
		private readonly metadata: MetadataStorage,
		private readonly config: ORMConfig,
		private readonly parent: ORM,
		public readonly useCache: boolean
	) {
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
		let entities: AnyEntity[] = Array.isArray(entity) ? entity : [entity];
		entities = entities.filter(e => !this.changeSet.find(c => c.persist === e));
		this.changeSet.push(...(entities.map(e => ({entityName: entityName as string, persist: e as ManagedEntity}))));
	}

	async flush(): Promise<void> {
		if (this.changeSet.length === 0) {
			return;
		}
		const t = await this.sequelize.transaction();
		try {
			for (const change of this.changeSet) {
				if (change.persist) {
					mapManagedToSource(change.persist);
					await change.persist._source.save({transaction: t});
				} else if (change.remove && change.remove.entity) {
					await change.remove.entity._source.destroy({transaction: t});
					this.parent.cache.remove(change.entityName, change.remove.entity);
				} else if (change.remove && change.remove.query) {
					const model = this.model(change.entityName);
					change.remove.resultCount = await model.destroy({where: change.remove.query.where, transaction: t});
					this.parent.cache.removePrefixed(change.entityName);
				}
			}
			for (const change of this.changeSet) {
				if (change.persist) {
					await saveManagedEntityRelations(change.persist, t);
				}
			}
			for (const change of this.changeSet) {
				if (change.persist) {
					cleanManagedEntityRelations(change.persist as ManagedEntity);
					this.parent.cache.remove(change.entityName, change.persist);
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

	// *

	private async fromCacheOrLoad<T extends IDEntity<T>>(entityName: EntityName<T>, ids: Array<string>): Promise<T[]> {
		const toLoadIDs: Array<string> = [];
		const fromCache: Array<T> = [];
		for (const id of ids) {
			const c = this.parent.cache.get(entityName, id);
			if (c) {
				fromCache.push(c as T);
			} else {
				toLoadIDs.push(id);
			}
		}
		if (toLoadIDs.length === 0) {
			return fromCache;
		}
		const model = this.model(entityName);
		const loadedSources = await model.findAll({where: {id: toLoadIDs}});
		const loaded = loadedSources.map(source => this.mapEntity(entityName, source));
		for (const item of loaded) {
			this.parent.cache.set(entityName, item);
		}
		return loaded.concat(fromCache).sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));
	}

	async findOne<T extends IDEntity<T>>(entityName: EntityName<T>, options: FindOptions<T>): Promise<T | undefined> {
		if (this.useCache) {
			const id = await this.findOneID(entityName, options);
			if (!id) {
				return;
			}
			const cached = this.parent.cache.get(entityName, id);
			if (cached) {
				return cached as T;
			}
		}
		const model = this.model(entityName);
		const source = await model.findOne(options);
		if (!source) {
			return;
		}
		const result = this.mapEntity(entityName, source);
		if (this.useCache) {
			this.parent.cache.set(entityName, result);
		}
		return result;
	}

	async findOneByID<T extends IDEntity<T>>(entityName: EntityName<T>, id: string): Promise<T | undefined> {
		if (!id || id.trim().length === 0) {
			return Promise.reject(Error('Invalid ID'));
		}
		if (this.useCache) {
			const cached = this.parent.cache.get(entityName, id);
			if (cached) {
				return cached as T;
			}
		}
		const model = this.model(entityName);
		const source = await model.findOne({where: {id}});
		if (!source) {
			return;
		}
		const result = this.mapEntity(entityName, source);
		if (this.useCache) {
			this.parent.cache.set(entityName, result);
		}
		return result;
	}

	async find<T extends IDEntity<T>>(entityName: EntityName<T>, options: FindOptions<T>): Promise<T[]> {
		if (this.useCache) {
			const ids = await this.findIDs(entityName, options);
			return await this.fromCacheOrLoad(entityName, ids);
		}
		const model = this.model(entityName);
		const rows = await model.findAll(options);
		return rows.map(source => this.mapEntity(entityName, source));
	}

	async findAndCount<T extends IDEntity<T>>(entityName: EntityName<T>, options: FindOptions<T>): Promise<{ count: number; entities: T[] }> {
		if (this.useCache) {
			const {count, ids} = await this.findIDsAndCount(entityName, options);
			const entities = await this.fromCacheOrLoad(entityName, ids);
			return {count, entities};
		}
		const model = this.model(entityName);
		const {count, rows} = await model.findAndCountAll(options);
		return {count, entities: rows.map(source => this.mapEntity(entityName, source))};
	}

	// *

	async all<T extends IDEntity<T>>(entityName: EntityName<T>): Promise<T[]> {
		return this.find(entityName, {});
	}

	async findOneOrFail<T extends IDEntity<T>>(entityName: EntityName<T>, options: FindOptions<T>): Promise<T> {
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

	public findByIDs<T extends IDEntity>(entityName: EntityName<T>, ids: Array<string>): Promise<T[]> {
		return this.find(entityName, {where: {id: ids} as any});
	}

	async findOneID<T extends IDEntity<T>>(entityName: EntityName<T>, options: FindOptions<T>): Promise<string | undefined> {
		const model = this.model(entityName);
		const opts = {...options, raw: true, attributes: ['id']};
		const result = await model.findOne<any>(opts);
		if (result) {
			return result.id;
		}
	}

	async findIDs<T extends IDEntity<T>>(entityName: EntityName<T>, options: FindOptions<T>): Promise<string[]> {
		const model = this.model(entityName);
		const opts = {...options, raw: true, attributes: ['id']};
		const result = await model.findAll<any>(opts);
		return result.map(o => o.id);
	}

	async findIDsAndCount<T extends IDEntity<T>>(entityName: EntityName<T>, options: FindOptions<T>): Promise<{ count: number; ids: string[] }> {
		const model = this.model(entityName);
		const opts = {...options, raw: true, attributes: ['id']};
		const {count, rows} = await model.findAndCountAll<any>(opts);
		return {count, ids: rows.map(o => o.id)};
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

	create<T extends IDEntity<T>>(entityName: EntityName<T>, data: EntityData<T>): T {
		const idData = {id: v4(), createdAt: new Date(), updatedAt: new Date(), ...data};
		const _source = this.model<T>(entityName).build(idData);
		const entity = this.mapEntity(entityName, _source);
		Object.keys(idData).forEach(key => (entity as any)[key] = (idData as any)[key]);
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

	removeLater<T extends AnyEntity<T>>(entityName: EntityName<T>, entity: AnyEntity | Array<AnyEntity>): void {
		const entities: AnyEntity[] = Array.isArray(entity) ? entity : [entity];
		this.changeSet.push(...(entities.map(e => ({entityName: entityName as string, remove: {entity: e as ManagedEntity}}))));
	}

	async removeByQueryAndFlush<T extends AnyEntity<T>>(entityName: EntityName<T>, options: FindOptions<T>): Promise<number> {
		const change = {entityName: entityName as string, remove: {query: options, resultCount: 0}};
		this.changeSet.push(change);
		await this.flush();
		return change.remove.resultCount;
	}

	hasChanges(): boolean {
		return this.changeSet.length > 0;
	}

	changesCount(): number {
		return this.changeSet.length;
	}

	public getOrderFindOptions<T>(entityName: EntityName<T>, order: Array<{ orderBy: any; orderDesc?: boolean }>): FindOptions<T> | undefined {
		const repo = this.getRepository(entityName);
		if (repo) {
			return repo.buildOrderByFindOptions(order);
		}
	}
}
