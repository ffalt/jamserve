import {AnyEntity, Constructor} from '../typings';
import {EntityRepository} from '../helpers/repository';

export interface ORMConfigRepositories {
	[entityName: string]: Constructor<EntityRepository<any>>;
}

export interface ORMConfig {
	storage: string;
	entities: Array<AnyEntity>;
	repositories: ORMConfigRepositories;
}
