import { SubsonicParameterID, SubsonicParameterShare } from '../model/subsonic-rest-parameters.js';

import { SubsonicRoute } from '../decorators/subsonic-route.js';
import { SubsonicParameters } from '../decorators/subsonic-parameters.js';
import { Context } from '../../engine/rest/context.js';
import { SubsonicOKResponse, SubsonicResponseShares } from '../model/subsonic-rest-data.js';
import { SubsonicController } from '../decorators/subsonic-controller.js';
import { SubsonicContext } from '../decorators/subsonic-context.js';
import { SubsonicApiError, SubsonicFormatter } from '../formatter.js';

@SubsonicController()
export class SubsonicSharingApi {
	/**
	 * Returns information about shared media this user is allowed to manage. Takes no extra parameters.
	 * Since 1.6.0
	 */
	@SubsonicRoute('/getShares', () => SubsonicResponseShares, {
		summary: 'Get Shares',
		description: 'Returns information about shared media this user is allowed to manage.',
		tags: ['Sharing']
	})
	async getShares(@SubsonicContext() _context: Context): Promise<SubsonicResponseShares> {
		return { shares: {} };
	}

	/**
	 * Creates a public URL that can be used by anyone to stream music or video from the Subsonic server.
	 * The URL is short and suitable for posting on Facebook, Twitter etc. Note: The user must be authorized to share (see Settings > Users > user is allowed to share files with anyone).
	 * Since 1.6.0
	 */
	@SubsonicRoute('/createShare', () => SubsonicOKResponse, {
		summary: 'Create Share',
		description: 'Creates a public URL that can be used by anyone to stream music or video from the Subsonic server.',
		tags: ['Sharing']
	})
	async createShare(@SubsonicParameters() _query: SubsonicParameterShare, @SubsonicContext() _context: Context): Promise<SubsonicOKResponse> {
		/*
		 Parameter 	Required 	Default 	Comment
		 id 	Yes 		ID of a song, album or video to share. Use one id parameter for each entry to share.
		 description 	No 		A user-defined description that will be displayed to people visiting the shared media.
		 expires 	No 		The time at which the share expires. Given as milliseconds since 1970.
		 */
		return Promise.reject(new SubsonicApiError(SubsonicFormatter.ERRORS.NO_SHARING));
	}

	/**
	 * Updates the description and/or expiration date for an existing share.
	 * Since 1.6.0
	 */
	@SubsonicRoute('/updateShare', () => SubsonicOKResponse, {
		summary: 'Update Share',
		description: 'Updates the description and/or expiration date for an existing share.',
		tags: ['Sharing']
	})
	async updateShare(@SubsonicParameters() _query: SubsonicParameterShare, @SubsonicContext() _context: Context): Promise<SubsonicOKResponse> {
		/*
		 Parameter 	Required 	Default 	Comment
		 id 	Yes 		ID of the share to update.
		 description 	No 		A user-defined description that will be displayed to people visiting the shared media.
		 expires 	No 		The time at which the share expires. Given as milliseconds since 1970, or zero to remove the expiration.
		 */
		return Promise.reject(new SubsonicApiError(SubsonicFormatter.ERRORS.NO_SHARING));
	}

	/**
	 * Deletes an existing share.
	 * Since 1.6.0
	 */
	@SubsonicRoute('/deleteShare', () => SubsonicOKResponse, {
		summary: 'Delete Share',
		description: 'Deletes an existing share.',
		tags: ['Sharing']
	})
	async deleteShare(@SubsonicParameters() _query: SubsonicParameterID, @SubsonicContext() _context: Context): Promise<SubsonicOKResponse> {
		/*
		 Parameter 	Required 	Default 	Comment
		 id 	Yes 		ID of the share to delete.
		*/
		return Promise.reject(new SubsonicApiError(SubsonicFormatter.ERRORS.NO_SHARING));
	}
}
