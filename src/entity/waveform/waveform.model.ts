import {ObjField, ResultType} from '../../modules/rest/index.js';

@ResultType({description: 'WaveForm Data'})
export class WaveFormData {
	@ObjField({description: 'The version number of the waveform data format', min: 1})
	version!: number;
	@ObjField({nullable: true, description: 'The number of waveform channels present (version 2 only)', min: 0})
	channels?: number;
	@ObjField({description: 'Sample rate of original audio file (Hz)', min: 0})
	sample_rate!: number;
	@ObjField({description: 'Number of audio samples per waveform minimum/maximum pair', min: 0})
	samples_per_pixel!: number;
	@ObjField({description: 'Resolution of waveform data. May be either 8 or 16', min: 0})
	bits!: number;
	@ObjField({description: 'Length of waveform data (number of minimum and maximum value pairs per channel)', min: 0})
	length!: number;
	@ObjField(() => [Number], {description: 'Array of minimum and maximum waveform data points, interleaved. Depending on bits, each value may be in the range -128 to +127 or -32768 to +32727'})
	data!: Array<number>;
}
