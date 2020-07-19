import {ObjField, ObjParamsType} from '../../modules/rest/decorators';
import {WaveformFormatType} from '../../types/enums';

@ObjParamsType()
export class WaveformArgs {
	@ObjField(() => WaveformFormatType, {nullable: true, description: 'format of the waveform', example: WaveformFormatType.svg})
	format?: WaveformFormatType;
	@ObjField({nullable: true, description: 'Width of svg', min: 100, max: 4000, example: 300})
	width?: number;
}

@ObjParamsType()
export class WaveformSVGArgs {
	@ObjField({description: 'Object Id'})
	id!: string;
	@ObjField({nullable: true, description: 'Width of svg', min: 100, max: 4000, example: 300})
	width?: number;
}
