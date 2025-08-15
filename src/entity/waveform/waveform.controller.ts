import { UserRole, WaveformFormatType } from '../../types/enums.js';
import fse from 'fs-extra';
import { WaveformParameters, WaveformSVGParameters } from './waveform.parameters.js';
import { WaveFormData } from './waveform.model.js';
import { ApiWaveformTypes } from '../../types/consts.js';
import { Context } from '../../modules/engine/rest/context.js';
import { Controller } from '../../modules/rest/decorators/controller.js';
import { Get } from '../../modules/rest/decorators/get.js';
import { QueryParameter } from '../../modules/rest/decorators/query-parameter.js';
import { RestContext } from '../../modules/rest/decorators/rest-context.js';
import { genericError, notFoundError } from '../../modules/deco/express/express-error.js';
import { QueryParameters } from '../../modules/rest/decorators/query-parameters.js';
import { PathParameter } from '../../modules/rest/decorators/path-parameter.js';
import { PathParameters } from '../../modules/rest/decorators/path-parameters.js';
import { ApiBinaryResult } from '../../modules/deco/express/express-responder.js';

@Controller('/waveform', { tags: ['Waveform'], roles: [UserRole.stream] })
export class WaveformController {
	@Get('/json',
		() => WaveFormData,
		{ description: 'Get Peaks Waveform Data as JSON [Episode, Track]', summary: 'Get JSON' }
	)
	async json(
		@QueryParameter('id', { description: 'Object Id', isID: true }) id: string,
		@RestContext() { orm, engine }: Context
	): Promise<WaveFormData | undefined> {
		const result = await orm.findInWaveformTypes(id);
		if (!result) {
			return Promise.reject(notFoundError());
		}
		const bin = await engine.waveform.getWaveform(result.obj, result.objType, WaveformFormatType.json);
		if (bin.json) {
			return bin.json as WaveFormData;
		}
		if (bin.buffer) {
			return JSON.parse(bin.buffer.buffer.toString()) as WaveFormData;
		}
		if (bin.file) {
			const file = await fse.readFile(bin.file.filename);
			return JSON.parse(file.toString()) as WaveFormData;
		}
		return Promise.reject(genericError('Error on Waveform generation'));
	}

	@Get('/svg',
		() => String,
		{
			description: 'Get Peaks Waveform Data as SVG [Episode, Track]', summary: 'Get SVG',
			responseStringMimeTypes: ['image/svg+xml']
		}
	)
	async svg(
		@QueryParameters() parameters: WaveformSVGParameters,
		@RestContext() { orm, engine }: Context
	): Promise<string> {
		const result = await orm.findInWaveformTypes(parameters.id);
		if (!result) {
			return Promise.reject(notFoundError());
		}
		const bin = await engine.waveform.getWaveform(result.obj, result.objType, WaveformFormatType.svg, parameters.width);
		if (bin.buffer) {
			return bin.buffer.buffer.toString();
		}
		if (bin.file) {
			const file = await fse.readFile(bin.file.filename);
			return file.toString();
		}
		return Promise.reject(genericError('Error on Waveform generation'));
	}

	@Get(
		'/{id}_{width}.{format}',
		{
			description: 'Get Peaks Waveform Data [Episode, Track]', summary: 'Get Waveform',
			binary: ApiWaveformTypes,
			customPathParameters: {
				regex: /(.*?)(_.*?)?(\..*)?$/,
				groups: [
					{ name: 'id', getType: () => String },
					{ name: 'width', getType: () => Number, prefix: '_', min: 100, max: 4000 },
					{ name: 'format', getType: () => WaveformFormatType, prefix: '.' }
				]
			},
			aliasRoutes: [
				{ route: '/{id}.{format}', name: 'by Id and Format', hideParameters: ['width'] },
				{ route: '/{id}', name: 'by Id', hideParameters: ['width', 'format'] }
			]
		}
	)
	async waveform(
		@PathParameter('id', { description: 'Media Id', isID: true }) id: string,
		@PathParameters() waveformParameters: WaveformParameters,
		@RestContext() { orm, engine }: Context
	): Promise<ApiBinaryResult | undefined> {
		const result = await orm.findInWaveformTypes(id);
		if (!result) {
			return Promise.reject(notFoundError());
		}
		return engine.waveform.getWaveform(result.obj, result.objType, waveformParameters.format, waveformParameters.width);
	}
}
