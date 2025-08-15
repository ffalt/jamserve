import { WaveformFormatType } from '../../types/enums.js';
import { ObjectParametersType } from '../../modules/rest/decorators/object-parameters-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';

@ObjectParametersType()
export class WaveformParameters {
	@ObjectField(() => WaveformFormatType, { nullable: true, description: 'format of the waveform', example: WaveformFormatType.svg })
	format?: WaveformFormatType;

	@ObjectField({ nullable: true, description: 'Width of svg', min: 100, max: 4000, example: 300 })
	width?: number;
}

@ObjectParametersType()
export class WaveformSVGParameters {
	@ObjectField({ description: 'Object Id' })
	id!: string;

	@ObjectField({ nullable: true, description: 'Width of svg', min: 100, max: 4000, example: 300 })
	width?: number;
}
