import { examples } from '../../modules/engine/rest/example.consts.js';
import { SessionMode } from '../../types/enums.js';
import { ResultType } from '../../modules/rest/decorators/result-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';

@ResultType({ description: 'User Session' })
export class UserSession {
	@ObjectField({ description: 'ID', isID: true })
	id!: string;

	@ObjectField({ description: 'Session Client', example: 'Jamberry v1' })
	client!: string;

	@ObjectField({ nullable: true, description: 'Session Expiration', example: examples.timestamp })
	expires?: number;

	@ObjectField(() => SessionMode, { description: 'Session Mode', example: SessionMode.browser })
	mode!: SessionMode;

	@ObjectField({ nullable: true, description: 'Session Platform', example: 'Amiga 500' })
	platform?: string;

	@ObjectField({ nullable: true, description: 'Session OS', example: 'Atari' })
	os?: string;

	@ObjectField({ description: 'Session User Agent', example: 'Amiga-AWeb/3.4.167SE”' })
	agent!: string;
}
