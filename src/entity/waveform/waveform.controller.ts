import {UserRole, WaveformFormatType} from '../../types/enums.js';
import fse from 'fs-extra';
import {WaveformArgs, WaveformSVGArgs} from './waveform.args.js';
import {WaveFormData} from './waveform.model.js';
import {ApiWaveformTypes} from '../../types/consts.js';
import {Context} from '../../modules/engine/rest/context.js';
import {Controller} from '../../modules/rest/decorators/Controller.js';
import {Get} from '../../modules/rest/decorators/Get.js';
import {QueryParam} from '../../modules/rest/decorators/QueryParam.js';
import {Ctx} from '../../modules/rest/decorators/Ctx.js';
import {GenericError, NotFoundError} from '../../modules/deco/express/express-error.js';
import {QueryParams} from '../../modules/rest/decorators/QueryParams.js';
import {PathParam} from '../../modules/rest/decorators/PathParam.js';
import {PathParams} from '../../modules/rest/decorators/PathParams.js';
import {ApiBinaryResult} from '../../modules/deco/express/express-responder.js';

@Controller('/waveform', {tags: ['Waveform'], roles: [UserRole.stream]})
export class WaveformController {
	@Get('/json',
		() => WaveFormData,
		{description: 'Get Peaks Waveform Data as JSON [Episode, Track]', summary: 'Get JSON'}
	)
	async json(
		@QueryParam('id', {description: 'Object Id', isID: true}) id: string,
		@Ctx() {orm, engine}: Context
	): Promise<WaveFormData | undefined> {
		const result = await orm.findInWaveformTypes(id);
		if (!result) {
			return Promise.reject(NotFoundError());
		}
		const bin = await engine.waveform.getWaveform(result.obj, result.objType, WaveformFormatType.json);
		if (bin.json) {
			return bin.json;
		}
		if (bin.buffer) {
			return JSON.parse(bin.buffer.buffer.toString());
		}
		if (bin.file) {
			return JSON.parse((await fse.readFile(bin.file.filename)).toString());
		}
		return Promise.reject(GenericError('Error on Waveform generation'));
	}

	@Get('/svg',
		() => String,
		{
			description: 'Get Peaks Waveform Data as SVG [Episode, Track]', summary: 'Get SVG',
			responseStringMimeTypes: ['image/svg+xml']
		}
	)
	async svg(
		@QueryParams() args: WaveformSVGArgs,
		@Ctx() {orm, engine}: Context
	): Promise<string> {
		const result = await orm.findInWaveformTypes(args.id);
		if (!result) {
			return Promise.reject(NotFoundError());
		}
		const bin = await engine.waveform.getWaveform(result.obj, result.objType, WaveformFormatType.svg, args.width);
		if (bin.buffer) {
			return bin.buffer.buffer.toString();
		}
		if (bin.file) {
			return (await fse.readFile(bin.file.filename)).toString();
		}
		return Promise.reject(GenericError('Error on Waveform generation'));
	}

	@Get(
		'/{id}_{width}.{format}',
		{
			description: 'Get Peaks Waveform Data [Episode, Track]', summary: 'Get Waveform',
			binary: ApiWaveformTypes,
			customPathParameters: {
				regex: /(.*?)(_.*?)?(\..*)?$/,
				groups: [
					{name: 'id', getType: () => String},
					{name: 'width', getType: () => Number, prefix: '_', min: 100, max: 4000},
					{name: 'format', getType: () => WaveformFormatType, prefix: '.'}
				]
			},
			aliasRoutes: [
				{route: '/{id}.{format}', name: 'by Id and Format', hideParameters: ['width']},
				{route: '/{id}', name: 'by Id', hideParameters: ['width', 'format']}
			]
		}
	)
	async waveform(
		@PathParam('id', {description: 'Media Id', isID: true}) id: string,
		@PathParams() waveformArgs: WaveformArgs,
		@Ctx() {orm, engine}: Context
	): Promise<ApiBinaryResult | undefined> {
		const result = await orm.findInWaveformTypes(id);
		if (!result) {
			return Promise.reject(NotFoundError());
		}
		return engine.waveform.getWaveform(result.obj, result.objType, waveformArgs.format, waveformArgs.width);
	}

}
