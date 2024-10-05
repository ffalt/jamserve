import { SubsonicOKResponse, SubsonicResponseInternetRadioStations } from '../model/subsonic-rest-data.js';

import { SubsonicRoute } from '../decorators/SubsonicRoute.js';
import { Context } from '../../engine/rest/context.js';
import { SubsonicParams } from '../decorators/SubsonicParams.js';
import { SubsonicParameterID, SubsonicParameterInternetRadioCreate, SubsonicParameterInternetRadioUpdate } from '../model/subsonic-rest-params.js';
import { SubsonicController } from '../decorators/SubsonicController.js';
import { SubsonicCtx } from '../decorators/SubsonicContext.js';
import { SubsonicFormatter } from '../formatter.js';

@SubsonicController()
export class SubsonicInternetRadioApi {
	/**
	 * Returns all internet radio stations. Takes no extra parameters.
	 * Since 1.9.0
	 */
	@SubsonicRoute('/getInternetRadioStations.view', () => SubsonicResponseInternetRadioStations, {
		summary: 'Get Radios',
		description: 'Returns all internet radio stations.',
		tags: ['Radio']
	})
	async getInternetRadioStations(@SubsonicCtx() { orm }: Context): Promise<SubsonicResponseInternetRadioStations> {
		const radios = (await orm.Radio.all()).filter(radio => !radio.disabled);
		const internetRadioStation = [];
		for (const radio of radios) {
			internetRadioStation.push(await SubsonicFormatter.packRadio(orm, radio));
		}
		return { internetRadioStations: { internetRadioStation } };
	}

	/**
	 * Adds a new internet radio station. Only users with admin privileges are allowed to call this method.
	 * Since 1.16.0
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
	 */
	@SubsonicRoute('/updateInternetRadioStation.view', () => SubsonicOKResponse, {
		summary: 'Update Radios',
		description: 'Updates an existing internet radio station. Only users with admin privileges are allowed to call this method.',
		tags: ['Radio']
	})
	async updateInternetRadioStation(@SubsonicParams() query: SubsonicParameterInternetRadioUpdate, @SubsonicCtx() { orm }: Context): Promise<SubsonicOKResponse> {
		/*
		Parameter 	Required 	Default 	Comment
		id 	Yes 		The ID for the station.
		streamUrl 	Yes 		The stream URL for the station.
		name 	Yes 		The user-defined name for the station.
		homepageUrl 	No 		The home page URL for the station.
		 */
		const radio = await orm.Subsonic.findOneSubsonicOrFailByID(query.id, orm.Radio);
		radio.name = query.name === undefined ? radio.name : query.name;
		radio.url = query.streamUrl === undefined ? radio.url : query.streamUrl;
		radio.homepage = query.homepageUrl === undefined ? radio.homepage : query.homepageUrl;
		await orm.Radio.persistAndFlush(radio);
		return {};
	}

	/**
	 * Deletes an existing internet radio station. Only users with admin privileges are allowed to call this method.
	 * Since 1.16.0
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

		const radio = await orm.Subsonic.findOneSubsonicOrFailByID(query.id, orm.Radio);
		await orm.Radio.removeAndFlush(radio);
		return {};
	}
}
