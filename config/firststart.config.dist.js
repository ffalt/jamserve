/*
	Add Admin user and media folders on first start
 */
module.exports = {
	/*
		Default Admin user
	*/
	adminUser: {
		name: 'admin',
		/*
		   Since the default admin password is stored in clear in this file,
		   you MUST change it on first login
		*/
		pass: 'admin'
	},
	/*
		Default Media folders
		Scan strategies:
		'auto' -- try to figure it out
		'artistalbum' -- artist/album folder structure
		'compilation' -- bunch of compilation folders
		'audiobook' -- bunch of audiobook folders
	 */
	roots: [
		{name: 'Music', path: 'path/to/music', strategy: 'auto'},
		{name: 'Compilations', path: 'path/to/compilations', strategy: 'compilation'},
		{name: 'Soundtracks', path: 'path/to/soundtracks', strategy: 'compilation'},
		{name: 'Audiobooks', path: 'path/to/audiobooks', strategy: 'audiobook'}
	]
};
