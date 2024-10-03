import { Base, Page } from '../base/base.model.js';
import { examples } from '../../modules/engine/rest/example.consts.js';
import { ResultType } from '../../modules/rest/decorators/ResultType.js';
import { ObjField } from '../../modules/rest/decorators/ObjField.js';

@ResultType({ description: 'Radio' })
export class Radio extends Base {
	@ObjField({ description: 'URL', example: 'https://radio.example.com/stream.m3u' })
	url!: string;

	@ObjField({ description: 'Homepage', example: 'https://radio.example.com' })
	homepage?: string;

	@ObjField({ description: 'Changed Timestamp', example: examples.timestamp })
	changed!: number;

	@ObjField({ nullable: true, description: 'Disabled', example: false })
	disabled?: boolean;
}

@ResultType({ description: 'Radio Page' })
export class RadioPage extends Page {
	@ObjField(() => Radio, { description: 'List of Radio' })
	items!: Array<Radio>;
}

@ResultType({ description: 'Radio Index Entry' })
export class RadioIndexEntry {
	@ObjField({ description: 'ID', isID: true })
	id!: string;

	@ObjField({ description: 'Name', example: 'Awesome Webradio' })
	name!: string;

	@ObjField({ description: 'URL', example: 'https://radio.example.com/stream.m3u' })
	url!: string;
}

@ResultType({ description: 'Radio Index Group' })
export class RadioIndexGroup {
	@ObjField({ description: 'Radio Group Name', example: 'P' })
	name!: string;

	@ObjField(() => [RadioIndexEntry])
	items!: Array<RadioIndexEntry>;
}

@ResultType({ description: 'Radio Index' })
export class RadioIndex {
	@ObjField({ description: 'Last Change Timestamp' })
	lastModified!: number;

	@ObjField(() => [RadioIndexGroup], { description: 'Radio Index Groups' })
	groups!: Array<RadioIndexGroup>;
}
