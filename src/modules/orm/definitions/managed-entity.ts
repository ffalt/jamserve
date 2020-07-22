import {AnyEntity} from '../typings';
import {EntityMetadata} from './entity-metadata';
import {EntityManager} from '../helpers/manager';

export interface ManagedEntity extends AnyEntity {
	_source: any;
	_em: EntityManager;
	_meta: EntityMetadata;
}


