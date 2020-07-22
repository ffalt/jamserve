import {Inject, InRequestScope} from 'typescript-ioc';
import {Controller, Ctx, Get, QueryParam} from '../../modules/rest';
import {UserRole, WaveformFormatType} from '../../types/enums';
import {ApiBinaryResult, NotFoundError} from '../../modules/rest/builder';
import {PathParam, PathParams, QueryParams} from '../../modules/rest/decorators';
import fse from 'fs-extra';
import {WaveformArgs, WaveformSVGArgs} from './waveform.args';
import {WaveformService} from './waveform.service';
import {WaveFormData} from './waveform.model';
import {ApiWaveformTypes} from '../../types/consts';
import {Context} from '../../modules/engine/rest/context';

@InRequestScope
@Controller('/waveform', {tags: ['Waveform'], roles: [UserRole.stream]})
export class WaveformController {
	@Inject
	private waveformService!: WaveformService;

	@Get('/json',
		() => WaveFormData,
		{description: 'Get Peaks Waveform Data as JSON [Episode, Track]', summary: 'Get JSON'}
	)
	async json(
		@QueryParam('id', {description: 'Object Id', isID: true}) id: string,
		@Ctx() {orm}: Context
	): Promise<WaveFormData | undefined> {
		const result = await orm.findInWaveformTypes(id);
		if (!result) {
			return Promise.reject(NotFoundError());
		}
		const bin = await this.waveformService.getWaveform(result.obj, result.objType, WaveformFormatType.json);
		if (bin.json) {
			return bin.json;
		}
		if (bin.buffer) {
			return JSON.parse(bin.buffer.buffer.toString());
		}
		if (bin.file) {
			return JSON.parse((await fse.readFile(bin.file.filename)).toString());
		}
		return Promise.reject(Error('Error on Waveform generation'));
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
		@Ctx() {orm}: Context
	): Promise<string> {
		const result = await orm.findInWaveformTypes(args.id);
		if (!result) {
			return Promise.reject(NotFoundError());
		}
		const bin = await this.waveformService.getWaveform(result.obj, result.objType, WaveformFormatType.svg, args.width);
		if (bin.buffer) {
			return bin.buffer.buffer.toString();
		}
		if (bin.file) {
			return (await fse.readFile(bin.file.filename)).toString();
		}
		return Promise.reject(Error('Error on Waveform generation'));
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
		@Ctx() {orm}: Context
	): Promise<ApiBinaryResult | undefined> {
		const result = await orm.findInWaveformTypes(id);
		if (!result) {
			return Promise.reject(NotFoundError());
		}
		return this.waveformService.getWaveform(result.obj, result.objType, waveformArgs.format, waveformArgs.width);
	}

}
