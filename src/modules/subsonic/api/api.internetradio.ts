import {SubsonicResponseInternetRadioStations} from '../model/subsonic-rest-data.js';
import {SubsonicApiBase} from './api.base.js';
import {FORMAT} from '../format.js';
import {SubsonicRoute} from '../decorators/SubsonicRoute.js';
import {Context} from '../../engine/rest/context.js';
import {SubsonicParams} from '../decorators/SubsonicParams.js';
import {SubsonicParameterID, SubsonicParameterInternetRadioCreate, SubsonicParameterInternetRadioUpdate} from '../model/subsonic-rest-params.js';

export class SubsonicInternetRadioApi extends SubsonicApiBase {
	/**
	 * Deletes an existing internet radio station. Only users with admin privileges are allowed to call this method.
	 * Since 1.16.0
	 * http://your-server/rest/deleteInternetRadioStation.view
	 * @return Returns an empty <subsonic-response> element on success.
	 */
	@SubsonicRoute('deleteInternetRadioStation.view')
	async deleteInternetRadioStation(@SubsonicParams() query: SubsonicParameterID, {orm}: Context): Promise<void> {
		/*
		Parameter 	Required 	Default 	Comment
		id 	Yes 		The ID for the station.
		 */
		const radio = await orm.Radio.findOneOrFailByID(query.id);
		await orm.Radio.removeAndFlush(radio);
	}

	/**
	 * Adds a new internet radio station. Only users with admin privileges are allowed to call this method.
	 * Since 1.16.0
	 * http://your-server/rest/createInternetRadioStation.view
	 * @return Returns an empty <subsonic-response> element on success.
	 */
	@SubsonicRoute('createInternetRadioStation.view')
	async createInternetRadioStation(@SubsonicParams() query: SubsonicParameterInternetRadioCreate, {orm}: Context): Promise<void> {
		/*
		Parameter 	Required 	Default 	Comment
		streamUrl 	Yes 		The stream URL for the station.
		name 	Yes 		The user-defined name for the station.
		homepageUrl 	No 		The home page URL for the station.
		 */
		const radio = orm.Radio.create({name: query.name, url: query.streamUrl, homepage: query.homepageUrl});
		await orm.Radio.persistAndFlush(radio);
	}

	/**
	 * Updates an existing internet radio station. Only users with admin privileges are allowed to call this method.
	 * Since 1.16.0
	 * http://your-server/rest/updateInternetRadioStation.view
	 * @return Returns an empty <subsonic-response> element on success.
	 */
	@SubsonicRoute('updateInternetRadioStation.view')
	async updateInternetRadioStation(@SubsonicParams() query: SubsonicParameterInternetRadioUpdate, {orm}: Context): Promise<void> {
		/*
		Parameter 	Required 	Default 	Comment
		id 	Yes 		The ID for the station.
		streamUrl 	Yes 		The stream URL for the station.
		name 	Yes 		The user-defined name for the station.
		homepageUrl 	No 		The home page URL for the station.
		 */
		const radio = await orm.Radio.findOneOrFailByID(query.id);
		radio.name = query.name === undefined ? radio.name : query.name
		radio.url = query.streamUrl === undefined ? radio.url : query.streamUrl
		radio.homepage = query.homepageUrl === undefined ? radio.homepage : query.homepageUrl
		await orm.Radio.persistAndFlush(radio);
	}

	/**
	 * Returns all internet radio stations. Takes no extra parameters.
	 * Since 1.9.0
	 * http://your-server/rest/getInternetRadioStations.view
	 * @return Returns a <subsonic-response> element with a nested <internetRadioStations> element on success.
	 */
	@SubsonicRoute('getInternetRadioStations.view', () => SubsonicResponseInternetRadioStations)
	async getInternetRadioStations(_query: unknown, {orm}: Context): Promise<SubsonicResponseInternetRadioStations> {
		const radios = await orm.Radio.all();
		return {internetRadioStations: {internetRadioStation: radios.filter(radio => !radio.disabled).map(radio => FORMAT.packRadio(radio))}};
	}
}
