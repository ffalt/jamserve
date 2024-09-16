import {InRequestScope} from 'typescript-ioc';
import {BaseTransformService} from '../base/base.transform.js';
import {Orm} from '../../modules/engine/services/orm.service.js';
import {Artwork as ORMArtwork} from './artwork.js';
import {IncludesArtworkArgs} from './artwork.args.js';
import {User} from '../user/user.js';
import {ArtworkBase} from './artwork.model.js';
import {DBObjectType} from '../../types/enums.js';

@InRequestScope
export class ArtworkTransformService extends BaseTransformService {

	async artworkBases(orm: Orm, list: Array<ORMArtwork>, artworkArgs: IncludesArtworkArgs, user: User): Promise<Array<ArtworkBase>> {
		return await Promise.all(list.map(t => this.artworkBase(orm, t, artworkArgs, user)));
	}

	async artworkBase(orm: Orm, o: ORMArtwork, artworkArgs: IncludesArtworkArgs, user: User): Promise<ArtworkBase> {
		return {
			id: o.id,
			name: o.name,
			types: o.types,
			height: o.height,
			width: o.width,
			format: o.format,
			created: o.createdAt.valueOf(),
			state: artworkArgs.artworkIncState ? await this.state(orm, o.id, DBObjectType.artwork, user.id) : undefined,
			size: o.fileSize
		};
	}

}
