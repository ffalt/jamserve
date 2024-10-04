import { SubsonicOKResponse, SubsonicResponseInternetRadioStations } from '../model/subsonic-rest-data.js';
import { SubsonicApiBase } from './api.base.js';
import { SubsonicRoute } from '../decorators/SubsonicRoute.js';
import { Context } from '../../engine/rest/context.js';
import { SubsonicParams } from '../decorators/SubsonicParams.js';
import { SubsonicParameterID, SubsonicParameterInternetRadioCreate, SubsonicParameterInternetRadioUpdate } from '../model/subsonic-rest-params.js';
import { SubsonicController } from '../decorators/SubsonicController.js';
import { SubsonicCtx } from '../decorators/SubsonicContext.js';

@SubsonicController()
export class SubsonicInternetRadioApi extends SubsonicApiBase {
	/**
	 * Returns all internet radio stations. Takes no extra parameters.
	 * Since 1.9.0
	 * http://your-server/rest/getInternetRadioStations.view
	 * @return Returns a <subsonic-response> element with a nested <internetRadioStations> element on success.
	 */
	@SubsonicRoute('/getInternetRadioStations.view', () => SubsonicResponseInternetRadioStations, {
		summary: 'Get Radios',
		description: 'Returns all internet radio stations.',
		tags: ['Radio']
	})
	async getInternetRadioStations(@SubsonicCtx() { orm }: Context): Promise<SubsonicResponseInternetRadioStations> {
		const radios = await orm.Radio.all();
		return {
			internetRadioStations: {
				internetRadioStation: await Promise.all(radios.filter(radio => !radio.disabled).map(radio => this.format.packRadio(radio)))
			}
		};
	}

	/**
	 * Adds a new internet radio station. Only users with admin privileges are allowed to call this method.
	 * Since 1.16.0
	 * http://your-server/rest/createInternetRadioStation.view
	 * @return Returns an empty <subsonic-response> element on success.
	 */
	@SubsonicRoute('/createInternetRadioStation.view', () => SubsonicOKResponse, {
		summary: 'Create Radios',
		description: 'Adds a new internet radio station. Only users with admin privileges are allowed to call this method.',
		tags: ['Radio']
	})
	async createInternetRadioStation(@SubsonicParams() query: SubsonicParameterInternetRadioCreate, @SubsonicCtx() { orm }: Context): Promise<SubsonicOKResponse> {
		/*
		Parameter 	Required 	Default 	Comment
		streamUrl 	Yes 		The stream URL for the station.
		name 	Yes 		The user-defined name for the station.
		homepageUrl 	No 		The home page URL for the station.
		 */
		const radio = orm.Radio.create({ name: query.name, url: query.streamUrl, homepage: query.homepageUrl });
		await orm.Radio.persistAndFlush(radio);
		return {};
	}

	/**
	 * Updates an existing internet radio station. Only users with admin privileges are allowed to call this method.
	 * Since 1.16.0
	 * http://your-server/rest/updateInternetRadioStation.view
	 * @return Returns an empty <subsonic-response> element on success.
	 */
	@SubsonicRoute('/updateInternetRadioStation.view', () => SubsonicOKResponse, {
		summary: 'Update Radios',
		description: 'Updates an existing internet radio station. Only users with admin privileges are allowed to call this method.',
		tags: ['Radio']
	})
	async updateInternetRadioStation(@SubsonicParams() query: SubsonicParameterInternetRadioUpdate,@SubsonicCtx()  { orm }: Context): Promise<SubsonicOKResponse> {
		/*
		Parameter 	Required 	Default 	Comment
		id 	Yes 		The ID for the station.
		streamUrl 	Yes 		The stream URL for the station.
		name 	Yes 		The user-defined name for the station.
		homepageUrl 	No 		The home page URL for the station.
		 */
		const radio = await this.subsonicORM.findOneOrFailByID(query.id, orm.Radio);
		radio.name = query.name === undefined ? radio.name : query.name;
		radio.url = query.streamUrl === undefined ? radio.url : query.streamUrl;
		radio.homepage = query.homepageUrl === undefined ? radio.homepage : query.homepageUrl;
		await orm.Radio.persistAndFlush(radio);
		return {};
	}

	/**
	 * Deletes an existing internet radio station. Only users with admin privileges are allowed to call this method.
	 * Since 1.16.0
	 * http://your-server/rest/deleteInternetRadioStation.view
	 * @return Returns an empty <subsonic-response> element on success.
	 */
	@SubsonicRoute('/deleteInternetRadioStation.view', () => SubsonicOKResponse, {
		summary: 'Delete Radios',
		description: 'Deletes an existing internet radio station. Only users with admin privileges are allowed to call this method.',
		tags: ['Radio']
	})
	async deleteInternetRadioStation(@SubsonicParams() query: SubsonicParameterID, @SubsonicCtx() { orm }: Context): Promise<SubsonicOKResponse> {
		/*
		Parameter 	Required 	Default 	Comment
		id 	Yes 		The ID for the station.
		 */

		const radio = await this.subsonicORM.findOneOrFailByID(query.id, orm.Radio);
		await orm.Radio.removeAndFlush(radio);
		return {};
	}
}
