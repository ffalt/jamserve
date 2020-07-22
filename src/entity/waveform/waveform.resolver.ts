import {Arg, Ctx, FieldResolver, ID, Int, Query, Resolver, Root as GQLRoot} from 'type-graphql';
import {Waveform, WaveformQL} from './waveform';
import {Context} from '../../modules/server/middlewares/apollo.context';
import {NotFoundError} from '../../modules/rest/builder';

@Resolver(WaveformQL)
export class WaveformResolver {

	@Query(() => WaveformQL)
	async waveform(
		@Arg('id', () => ID!) id: string,
		@Ctx() {orm}: Context
	): Promise<Waveform> {
		const result = await orm.findInWaveformTypes(id);
		if (!result) {
			return Promise.reject(NotFoundError());
		}
		return result;
	}

	@FieldResolver(() => String)
	async json(@GQLRoot() waveform: Waveform, @Ctx() {engine}: Context): Promise<string> {
		return JSON.stringify(await engine.waveformService.getWaveformJSON(waveform.obj, waveform.objType));
	}

	@FieldResolver(() => String)
	async svg(@GQLRoot() waveform: Waveform, @Arg('width', () => Int) width: number, @Ctx() {engine}: Context): Promise<string> {
		return (await engine.waveformService.getWaveformSVG(waveform.obj, waveform.objType, width)) || '';
	}
}

