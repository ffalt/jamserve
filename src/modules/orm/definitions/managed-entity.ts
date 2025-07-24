import { IDEntity } from '../typings.js';
import { EntityMetadata } from './entity-metadata.js';
import { EntityManager } from '../helpers/manager.js';
import { Model } from 'sequelize';

export interface ManagedEntity extends IDEntity {
	_source: Model & Record<string, any>;
	_em: EntityManager;
	_meta: EntityMetadata;
}
