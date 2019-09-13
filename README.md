# Jamserve Audio Server

An audio library server written in Typescript for NodeJS

## Preamble

This is my current pet project to manage/stream/edit my own music collection. It's not ready yet a.k.a. work in progress. Everything is subject to change. Please do not use it for other than testing purposes until further notice.

It's heavily inspired by the now closed source Java Server [Subsonic](http://www.subsonic.org/pages/index.jsp) (it even has a Subsonic compatible API, so compatible streaming apps can be used).

This is the backend development repository. Web-Client, Installation & Usage Scripts (e.g. with Docker) will be published soon® in different repositories.

Features:
* API for Media Scanning, Streaming, Transcoding, MP3 ID3v2 Editing, User Management
* API Specs & Documentation with OpenAPI, see [JamAPI](https://editor.swagger.io/?url=https://raw.githubusercontent.com/ffalt/jamserve/master/src/model/jam-openapi.json)
* Enhance Metadata via Musicbrainz, LastFM, Wikipedia, lyricsOVH & AcoustID
* Database Support for NeDB or ElasticSearch

## Requirements

- install [NodeJS](https://nodejs.org/) >= 8.x and [NPM](https://www.npmjs.com/)
- install [FFMPEG](https://ffmpeg.org/) 
  and set [environment variable](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg#ffmpeg-and-ffprobe) FFPROBE_PATH and FFMPEG_PATH

 optional for meta data matching & mp3 repair support
- install [fpcalc](https://github.com/acoustid/chromaprint/releases/) and set environment variable: FPCALC_PATH
- install [mp3val](http://mp3val.sourceforge.net/) and set environment variable: MP3VAL_PATH


## Installation

- run command `npm install` in the root folder of this repository

- in folder 'config': copy file 'config.dist.js' to 'config.js' and make the changes to reflect your infrastructure

- in folder 'config': copy file 'firststart.config.dist.js' to 'firststart.config.js' and add a first user / add some media folders


Example **config/config.js** for debugging on localhost (no elastic search):

```javascript
module.exports = {
  paths: {
    /*
      Root JamServe data directory (not the media files)
    */
    data: './data/',
    /*
      Root frontend directory
    */
    frontend: './dist/jamberry/'
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
        secure: false,
        /*
          If true, server trusts first reverse proxy like nginx
         */
        proxy: false,
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
```

Example **config/firststart.config.js**:

```javascript
/*
  Add Admin user and media folders on first start
 */
module.exports = {
  /*
    Default Admin user
  */
  adminUser: {
    name: 'admin',
    pass: 'your admin password'
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
```

## Commands


### Start

`npm run start` to run the server (available after a successful build)

### Development Build

`npm run build:dev` to build the server into dist/bundle.js

### Production Build

`npm run build:prod` to build the server into dist/bundle.js

### Generate Documentation

`npm run build:docs` to build the server into dist/docs

### Update Model & Definition Files

`npm run build:model` to build json schemes & openapi jsons

### Develop

`npm run develop` to run the server & rebuild/reload on source file changes

### CleanDB

`npm run cleandb` to complete empty the current database

### Clean Dist

`npm run clean` to clear the distribution folder

### Test

`npm run test` to run all tests

### Test Coverage

`npm run coverage` to run all tests & generate a coverage report
