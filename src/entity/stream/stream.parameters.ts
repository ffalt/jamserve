import { AudioFormatType } from '../../types/enums.js';
import { ObjectParametersType } from '../../modules/rest/decorators/object-parameters-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';

@ObjectParametersType()
export class StreamPathParameters {
	@ObjectField({ nullable: true, description: 'maximal bitrate if transcoding (in Kbps)', min: 10, max: 480, example: 128 })
	maxBitRate?: number;

	@ObjectField(() => AudioFormatType, { nullable: true, description: 'format of the audio', example: AudioFormatType.mp3 })
	format?: AudioFormatType;
}

@ObjectParametersType()
export class StreamParameters {
	@ObjectField({ nullable: true, description: 'start offset for transcoding/streaming', min: 0, example: 128 })
	timeOffset?: number;
}
