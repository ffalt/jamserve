import {AnyEntity, Constructor} from '../typings';
import {EntityRepository} from '../helpers/repository';
import {Options} from 'sequelize';

export interface ORMConfigRepositories {
	[entityName: string]: Constructor<EntityRepository<any>>;
}

export interface ORMConfig {
	options: Options;
	entities: Array<AnyEntity>;
	repositories: ORMConfigRepositories;
}
