import { SubsonicParameterID, SubsonicParameterShare } from '../model/subsonic-rest-params.js';
import { SubsonicApiBase } from './api.base.js';
import { SubsonicRoute } from '../decorators/SubsonicRoute.js';
import { SubsonicParams } from '../decorators/SubsonicParams.js';
import { Context } from '../../engine/rest/context.js';
import { SubsonicResponseShares } from '../model/subsonic-rest-data.js';

export class SubsonicSharingApi extends SubsonicApiBase {
	/**
	 * Returns information about shared media this user is allowed to manage. Takes no extra parameters.
	 * Since 1.6.0
	 * http://your-server/rest/getShares.view
	 * @return Returns a <subsonic-response> element with a nested <shares> element on success.
	 */
	@SubsonicRoute('getShares.view', () => SubsonicResponseShares)
	async getShares(_query: unknown, _ctx: Context): Promise<SubsonicResponseShares> {
		return { shares: {} };
	}

	/**
	 * Creates a public URL that can be used by anyone to stream music or video from the Subsonic server.
	 * The URL is short and suitable for posting on Facebook, Twitter etc. Note: The user must be authorized to share (see Settings > Users > user is allowed to share files with anyone).
	 * Since 1.6.0
	 * http://your-server/rest/createShare.view
	 * @return  Returns a <subsonic-response> element with a nested <shares> element on success, which in turns contains a single <share> element for the newly created share.
	 */
	@SubsonicRoute('createShare.view')
	async createShare(@SubsonicParams() _query: SubsonicParameterShare, _ctx: Context): Promise<void> {
		/*
		 Parameter 	Required 	Default 	Comment
		 id 	Yes 		ID of a song, album or video to share. Use one id parameter for each entry to share.
		 description 	No 		A user-defined description that will be displayed to people visiting the shared media.
		 expires 	No 		The time at which the share expires. Given as milliseconds since 1970.
		 */
		return Promise.reject('not implemented');
	}

	/**
	 * Updates the description and/or expiration date for an existing share.
	 * Since 1.6.0
	 * http://your-server/rest/updateShare.view
	 * @return Returns an empty <subsonic-response> element on success.
	 */
	@SubsonicRoute('updateShare.view')
	async updateShare(@SubsonicParams() _query: SubsonicParameterShare, _ctx: Context): Promise<void> {
		/*
		 Parameter 	Required 	Default 	Comment
		 id 	Yes 		ID of the share to update.
		 description 	No 		A user-defined description that will be displayed to people visiting the shared media.
		 expires 	No 		The time at which the share expires. Given as milliseconds since 1970, or zero to remove the expiration.
		 */
		return Promise.reject('not implemented');
	}

	/**
	 * Deletes an existing share.
	 * Since 1.6.0
	 * http://your-server/rest/deleteShare.view
	 * @return Returns an empty <subsonic-response> element on success.
	 */
	@SubsonicRoute('deleteShare.view')
	async deleteShare(@SubsonicParams() _query: SubsonicParameterID, _ctx: Context): Promise<void> {
		/*
		 Parameter 	Required 	Default 	Comment
		 id 	Yes 		ID of the share to delete.
		*/
		return Promise.reject('not implemented');
	}
}
