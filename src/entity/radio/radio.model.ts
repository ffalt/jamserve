import { Base, Page } from '../base/base.model.js';
import { examples } from '../../modules/engine/rest/example.consts.js';
import { ResultType } from '../../modules/rest/decorators/result-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';

@ResultType({ description: 'Radio' })
export class Radio extends Base {
	@ObjectField({ description: 'URL', example: 'https://radio.example.com/stream.m3u' })
	url!: string;

	@ObjectField({ description: 'Homepage', example: 'https://radio.example.com' })
	homepage?: string;

	@ObjectField({ description: 'Changed Timestamp', example: examples.timestamp })
	changed!: number;

	@ObjectField({ nullable: true, description: 'Disabled', example: false })
	disabled?: boolean;
}

@ResultType({ description: 'Radio Page' })
export class RadioPage extends Page {
	@ObjectField(() => Radio, { description: 'List of Radio' })
	items!: Array<Radio>;
}

@ResultType({ description: 'Radio Index Entry' })
export class RadioIndexEntry {
	@ObjectField({ description: 'ID', isID: true })
	id!: string;

	@ObjectField({ description: 'Name', example: 'Awesome Webradio' })
	name!: string;

	@ObjectField({ description: 'URL', example: 'https://radio.example.com/stream.m3u' })
	url!: string;
}

@ResultType({ description: 'Radio Index Group' })
export class RadioIndexGroup {
	@ObjectField({ description: 'Radio Group Name', example: 'P' })
	name!: string;

	@ObjectField(() => [RadioIndexEntry])
	items!: Array<RadioIndexEntry>;
}

@ResultType({ description: 'Radio Index' })
export class RadioIndex {
	@ObjectField({ description: 'Last Change Timestamp' })
	lastModified!: number;

	@ObjectField(() => [RadioIndexGroup], { description: 'Radio Index Groups' })
	groups!: Array<RadioIndexGroup>;
}
