import {AudioFormatType} from '../../types/enums.js';
import {ObjParamsType} from '../../modules/rest/decorators/ObjParamsType.js';
import {ObjField} from '../../modules/rest/decorators/ObjField.js';

@ObjParamsType()
export class StreamArgs {
	@ObjField({nullable: true, description: 'maximal bitrate if transcoding (in Kbps)', min: 10, max: 480, example: 128})
	maxBitRate?: number;
	@ObjField(() => AudioFormatType, {nullable: true, description: 'format of the audio', example: AudioFormatType.mp3})
	format?: AudioFormatType;
}
