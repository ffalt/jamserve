import { SubsonicOKResponse, SubsonicResponseInternetRadioStations } from '../model/subsonic-rest-data.js';

import { SubsonicRoute } from '../decorators/SubsonicRoute.js';
import { Context } from '../../engine/rest/context.js';
import { SubsonicParams } from '../decorators/SubsonicParams.js';
import { SubsonicParameterID, SubsonicParameterInternetRadioCreate, SubsonicParameterInternetRadioUpdate } from '../model/subsonic-rest-params.js';
import { SubsonicController } from '../decorators/SubsonicController.js';
import { SubsonicCtx } from '../decorators/SubsonicContext.js';
import { SubsonicApiError, SubsonicFormatter } from '../formatter.js';

@SubsonicController()
export class SubsonicInternetRadioApi {
	/**
	 * Returns all internet radio stations. Takes no extra parameters.
	 * Since 1.9.0
	 */
	@SubsonicRoute('/getInternetRadioStations', () => SubsonicResponseInternetRadioStations, {
		summary: 'Get Radios',
		description: 'Returns all internet radio stations.',
		tags: ['Radio']
	})
	async getInternetRadioStations(@SubsonicCtx() { orm }: Context): Promise<SubsonicResponseInternetRadioStations> {
		const radios = (await orm.Radio.all()).filter(radio => !radio.disabled);
		const internetRadioStation = [];
		for (const radio of radios) {
			internetRadioStation.push(await SubsonicFormatter.packRadio(radio));
		}
		return { internetRadioStations: { internetRadioStation } };
	}

	/**
	 * Adds a new internet radio station. Only users with admin privileges are allowed to call this method.
	 * Since 1.16.0
	 */
	@SubsonicRoute('/createInternetRadioStation', () => SubsonicOKResponse, {
		summary: 'Create Radios',
		description: 'Adds a new internet radio station. Only users with admin privileges are allowed to call this method.',
		tags: ['Radio']
	})
	async createInternetRadioStation(@SubsonicParams() query: SubsonicParameterInternetRadioCreate, @SubsonicCtx() { orm, user }: Context): Promise<SubsonicOKResponse> {
		/*
		Parameter 	Required 	Default 	Comment
		streamUrl 	Yes 		The stream URL for the station.
		name 	Yes 		The user-defined name for the station.
		homepageUrl 	No 		The home page URL for the station.
		 */
		if (!user.roleAdmin) {
			return Promise.reject(new SubsonicApiError(SubsonicFormatter.ERRORS.UNAUTH));
		}
		const radio = orm.Radio.create({ name: query.name, url: query.streamUrl, homepage: query.homepageUrl, disabled: false });
		await orm.Radio.persistAndFlush(radio);
		return {};
	}

	/**
	 * Updates an existing internet radio station. Only users with admin privileges are allowed to call this method.
	 * Since 1.16.0
	 */
	@SubsonicRoute('/updateInternetRadioStation', () => SubsonicOKResponse, {
		summary: 'Update Radios',
		description: 'Updates an existing internet radio station. Only users with admin privileges are allowed to call this method.',
		tags: ['Radio']
	})
	async updateInternetRadioStation(@SubsonicParams() query: SubsonicParameterInternetRadioUpdate, @SubsonicCtx() { orm, user }: Context): Promise<SubsonicOKResponse> {
		/*
		Parameter 	Required 	Default 	Comment
		id 	Yes 		The ID for the station.
		streamUrl 	Yes 		The stream URL for the station.
		name 	Yes 		The user-defined name for the station.
		homepageUrl 	No 		The home page URL for the station.
		 */
		if (!user.roleAdmin) {
			return Promise.reject(new SubsonicApiError(SubsonicFormatter.ERRORS.UNAUTH));
		}
		const radio = await orm.Radio.findOneOrFailByID(query.id);
		radio.name = query.name ?? radio.name;
		radio.url = query.streamUrl ?? radio.url;
		radio.homepage = query.homepageUrl ?? radio.homepage;
		await orm.Radio.persistAndFlush(radio);
		return {};
	}

	/**
	 * Deletes an existing internet radio station. Only users with admin privileges are allowed to call this method.
	 * Since 1.16.0
	 */
	@SubsonicRoute('/deleteInternetRadioStation', () => SubsonicOKResponse, {
		summary: 'Delete Radios',
		description: 'Deletes an existing internet radio station. Only users with admin privileges are allowed to call this method.',
		tags: ['Radio']
	})
	async deleteInternetRadioStation(@SubsonicParams() query: SubsonicParameterID, @SubsonicCtx() { orm, user }: Context): Promise<SubsonicOKResponse> {
		/*
		Parameter 	Required 	Default 	Comment
		id 	Yes 		The ID for the station.
		 */
		if (!user.roleAdmin) {
			return Promise.reject(new SubsonicApiError(SubsonicFormatter.ERRORS.UNAUTH));
		}
		const radio = await orm.Radio.findOneOrFailByID(query.id);
		await orm.Radio.removeAndFlush(radio);
		return {};
	}
}
