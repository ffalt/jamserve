/*
	Add Admin user and media folders on first start
 */
module.exports = {
	/*
		Default Admin user
	*/
	adminUser: {
		name: 'admin',
		pass: 'admin'
	},
	/*
		Default Media folders
	 */
	roots: [
		{name: 'Music', path: 'path/to/music'},
		{name: 'Compilations', path: 'path/to/compilations'},
		{name: 'Soundtracks', path: 'path/to/soundtracks'},
		{name: 'Audiobooks', path: 'path/to/audiobooks'}
	]
};
