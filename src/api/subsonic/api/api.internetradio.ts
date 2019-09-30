import {Subsonic} from '../../../model/subsonic-rest-data';
import {SubsonicParameters} from '../../../model/subsonic-rest-params';
import {ApiOptions, SubsonicApiBase} from '../base';
import {FORMAT} from '../format';

export class SubsonicInternetRadioApi extends SubsonicApiBase {

	/**
	 * Deletes an existing internet radio station. Only users with admin privileges are allowed to call this method.
	 * Since 1.16.0
	 * http://your-server/rest/deleteInternetRadioStation.view
	 * @return Returns an empty <subsonic-response> element on success.
	 */
	async deleteInternetRadioStation(req: ApiOptions<SubsonicParameters.ID>): Promise<void> {
		/*
		Parameter 	Required 	Default 	Comment
		id 	Yes 		The ID for the station.
		 */
		const radio = await this.byID(req.query.id, this.engine.store.radioStore);
		await this.engine.store.radioStore.remove(radio.id);
	}

	/**
	 * Adds a new internet radio station. Only users with admin privileges are allowed to call this method.
	 * Since 1.16.0
	 * http://your-server/rest/createInternetRadioStation.view
	 * @return Returns an empty <subsonic-response> element on success.
	 */
	async createInternetRadioStation(req: ApiOptions<SubsonicParameters.InternetRadioCreate>): Promise<void> {
		/*
		Parameter 	Required 	Default 	Comment
		streamUrl 	Yes 		The stream URL for the station.
		name 	Yes 		The user-defined name for the station.
		homepageUrl 	No 		The home page URL for the station.
		 */
		await this.engine.radioService.create(req.query.name, req.query.streamUrl, req.query.homepageUrl);
	}

	/**
	 * Updates an existing internet radio station. Only users with admin privileges are allowed to call this method.
	 * Since 1.16.0
	 * http://your-server/rest/updateInternetRadioStation.view
	 * @return Returns an empty <subsonic-response> element on success.
	 */
	async updateInternetRadioStation(req: ApiOptions<SubsonicParameters.InternetRadioUpdate>): Promise<void> {
		/*
		Parameter 	Required 	Default 	Comment
		id 	Yes 		The ID for the station.
		streamUrl 	Yes 		The stream URL for the station.
		name 	Yes 		The user-defined name for the station.
		homepageUrl 	No 		The home page URL for the station.
		 */
		const radio = await this.byID(req.query.id, this.engine.store.radioStore);
		await this.engine.radioService.update(radio, req.query.name, req.query.streamUrl, req.query.homepageUrl);
	}

	/**
	 * Returns all internet radio stations. Takes no extra parameters.
	 * Since 1.9.0
	 * http://your-server/rest/getInternetRadioStations.view
	 * @return Returns a <subsonic-response> element with a nested <internetRadioStations> element on success.
	 */
	async getInternetRadioStations(req: ApiOptions<{}>): Promise<{ internetRadioStations: Subsonic.InternetRadioStations }> {
		const radios = await this.engine.store.radioStore.all();
		return {internetRadioStations: {internetRadioStation: radios.filter(radio => !radio.disabled).map(radio => FORMAT.packRadio(radio))}};
	}

}
