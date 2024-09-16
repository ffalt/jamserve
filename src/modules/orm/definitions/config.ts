import {AnyEntity, Constructor} from '../typings.js';
import {EntityRepository} from '../helpers/repository.js';
import {Options} from 'sequelize';

export interface ORMConfigRepositories {
	[entityName: string]: Constructor<EntityRepository<any>>;
}

export interface ORMConfig {
	options: Options;
	entities: Array<AnyEntity>;
	repositories: ORMConfigRepositories;
}
