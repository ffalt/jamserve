import { ObjField, ResultType } from '../../modules/rest/index.js';
import { examples } from '../../modules/engine/rest/example.consts.js';
import { SessionMode } from '../../types/enums.js';

@ResultType({ description: 'User Session' })
export class UserSession {
	@ObjField({ description: 'ID', isID: true })
	id!: string;

	@ObjField({ description: 'Session Client', example: 'Jamberry v1' })
	client!: string;

	@ObjField({ nullable: true, description: 'Session Expiration', example: examples.timestamp })
	expires?: number;

	@ObjField(() => SessionMode, { description: 'Session Mode', example: SessionMode.browser })
	mode!: SessionMode;

	@ObjField({ nullable: true, description: 'Session Platform', example: 'Amiga 500' })
	platform?: string;

	@ObjField({ nullable: true, description: 'Session OS', example: 'Atari' })
	os?: string;

	@ObjField({ description: 'Session User Agent', example: 'Amiga-AWeb/3.4.167SE”' })
	agent!: string;
}
