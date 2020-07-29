import {AnyEntity} from '../typings';
import {EntityMetadata} from './entity-metadata';
import {EntityManager} from '../helpers/manager';
import {Model} from 'sequelize/types/lib/model';

export interface ManagedEntity extends AnyEntity {
	_source: Model & { [name: string]: any };
	_em: EntityManager;
	_meta: EntityMetadata;
}


