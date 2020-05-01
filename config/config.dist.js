module.exports = {
	paths: {
		/*
			Root JamServe data directory (not the media files)
		*/
		data: './data/',
		/*
			Root frontend directory
		*/
		frontend: './static/jamberry/'
	},
	server: {
		/*
			Server listen address
		*/
		listen: '0.0.0.0',
		/*
			Server listen port
		*/
		port: 4040,
		/*
			Login: Cookie Session
		*/
		session: {
			/*
				Due to CORS security you MUST name all domains where login with session cookie is allowed
				https://de.wikipedia.org/wiki/Cross-Origin_Resource_Sharing
				(background: random sites cannot access/create cookies for your domain)
			*/
			allowedCookieDomains: ['http://localhost:4040'],
			/*
				An unique string for your instance to sign the session cookie (change it!)
			    http://www.senchalabs.org/connect/session.html
			*/
			secret: 'keyboard cat is dancing',
			cookie: {
				/*
					The session cookie name
				*/
				name: 'jam.sid',
				/*
					If true, session cookies are only available for https, NOT http
				 */
				secure: true,
				/*
					If true, server trusts first reverse proxy like nginx
				 */
				proxy: true,
				/*
					Max Age for a valid session cookie (set 0 for no expiration)
				 */
				maxAge: {
					/*
						Numeric Max Age Value
					 */
					value: 1,
					/*
						Max Age Value Unit
						possible values: 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute'
					 */
					unit: 'day'
				}
			}
		},
		/*
			Login: JSON Web Token
			https://jwt.io/
		 */
		jwt: {
			/*
				An unique string for your instance to sign the token (change it!)
			*/
			secret: 'keyboard cat is stomping',
			/*
			    Max Age for a valid token (set 0 for no expiration)
			*/
			maxAge: {
				/*
					Numeric Max Age Value
				 */
				value: 1,
				/*
					Max Age Value Unit
					possible values: 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute'
				 */
				unit: 'day'
			}
		},
		/*
			access rate limiting
		 */
		limit: {
			/*
				limiter for fail login attempts
		 	*/
			login: {
				/*
					${max} failed requests
				 */
				max: 5,
				/*
					time ${window} in seconds
				 */
				window: 60 // 1 minute
			},
			api: {
				/*
					${max} failed requests
				 */
				max: 20,
				/*
					time ${window} in seconds
				 */
				window: 60 // 1 minute
			}
		}
	},
	database: {
		/*
			Database to use
			possible values: 'nedb' | 'elasticsearch'
		*/
		use: 'nedb',
		options: {
			/*
				ElasticSearch Options
			*/
			elasticsearch: {
				host: 'http://localhost:9200',
				/*
					ElasticSearch Index Names e.g. jam_artist jam_album jam_track ...
				*/
				indexPrefix: 'jam',
				/*
					 How to apply index changes (setting needed for tests to immediately apply changes)
					 https://www.elastic.co/guide/en/elasticsearch/reference/current/docs-refresh.html
				     possible values: 'wait_for' | true | false | undefined
				*/
				indexRefresh: undefined,
				/*
					Elastic Search Log Levels
				    possible values: 'warning' 'error' | 'trace';
				*/
				log: ['error', 'trace']
			},
			/*
				Nedb Options
			*/
			nedb: {}
		}
	},
	log: {
		/*
			Set the application log level
			possible values: 'error' | 'warn' | 'info' | 'debug'
			default: 'info'
		 */
		level: 'info'
	}
};
