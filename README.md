# Jamserve Audio Server

An audio library server written in Typescript for NodeJS

[![Test](https://github.com/ffalt/jamserve/workflows/test/badge.svg)](https://github.com/ffalt/jamserve/actions?query=workflow%3Atest)
[![Maintainability](https://api.codeclimate.com/v1/badges/78793d8ce54f2e8e6236/maintainability)](https://codeclimate.com/github/ffalt/jamserve/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/78793d8ce54f2e8e6236/test_coverage)](https://codeclimate.com/github/ffalt/jamserve/test_coverage)

## Preamble

This is my current pet project to manage/stream/edit my own music collection.
It's not ready yet, a.k.a. work in progress. Everything is subject to change.
Please do not use it for other than testing purposes until further notice.

This is the backend development repository. See

[Jamberry](https://github.com/ffalt/jamberry) for web-client development

[Jampacked](https://github.com/ffalt/jampacked) for mobile app development

[Jam-Dockerimage](https://github.com/ffalt/jam-dockerimage) Docker-Image for JamServe & Jamberry

[Jam-Docker](https://github.com/ffalt/jam-docker) run JamServe & Jamberry with Docker

Features:

*   REST & GraphQL API for Media Scanning, Streaming, Transcoding, MP3 ID3v2 Editing, User Management
*   API Specs & Documentation with OpenAPI, see [JamAPI](https://editor.swagger.io/?url=https://raw.githubusercontent.com/ffalt/jamserve/main/specs/jam.openapi.json)
*   Enhance Metadata via Musicbrainz, LastFM, Wikipedia, lyricsOVH & AcoustID
*   Database Support for [postgresql](https://www.postgresql.org/) and SQLite for local development
    (planned: some more supported by [sequelize](https://sequelize.org))

## Requirements

*   install [NodeJS](https://nodejs.org/) >= 14.x and [NPM](https://www.npmjs.com/)

*   install [FFMPEG](https://ffmpeg.org/)

    `apt-get install ffmpeg`

     manual installation: available in PATH or [environment variable](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg#ffmpeg-and-ffprobe): *FFPROBE_PATH* and *FFMPEG_PATH*

optional for metadata matching & mp3 repair support

*   install [fpcalc](https://github.com/acoustid/chromaprint/releases/)

    `apt-get install libchromaprint-tools`

     manual installation: available in PATH or environment variable *FPCALC_PATH*

*   install [mp3val](http://mp3val.sourceforge.net/)

    `apt-get install mp3val`

     manual installation: available in PATH or environment variable *MP3VAL_PATH*

*   install [flac](https://xiph.org/flac/)

    `apt-get install flac`

     manual installation: available in PATH or environment variable *FLAC_PATH*

## Installation

*   run command `npm install` in the root folder of this repository
*   in folder `config`: 
    copy file `firststart.config.dist.js` to `firststart.config.js` and 
    add an admin user / add some media folders (can be changed on runtime via the frontend UI)
*   set environment variables or create an environment variables file `.env`

## Environment Variables

Example `.env` file for debugging on localhost

```dosini
## Server

# Server Domain URL (e.g. https://music.yourdomain.somewhere)
JAM_DOMAIN=http://localhost:4040

# Server listen address
JAM_HOST=0.0.0.0

# Server listen port
JAM_PORT=4040

# Log Level, possible values: 'error' | 'warn' | 'info' | 'debug'
JAM_LOG_LEVEL=debug

# JamServe data directory (NOT the media files)
JAM_DATA_PATH=./data/

# JamServe Frontend Path
JAM_FRONTEND_PATH=./static/jamberry/

## JSON Web Token https://jwt.io/

# An unique string for your instance to sign the jwt tokens
JAM_JWT_SECRET=keyboard cat is stomping

# Max Age for a valid jwt (set 0 for no expiration)
# possible values: 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute'
JAM_JWT_MAXAGE=1 day


## Login: Cookie Session

# Due to CORS security you MUST name all domains where login with session cookie is allowed
# https://de.wikipedia.org/wiki/Cross-Origin_Resource_Sharing
# (background: random sites cannot access/create cookies for your domain)
JAM_ALLOWED_COOKIE_DOMAINS=http://localhost:4040,http://localhost:4200

# An unique string for your instance to sign the session cookie (change it!)
# http://www.senchalabs.org/connect/session.html
JAM_SESSION_SECRET=keyboard cat is dancing

# If true, session cookies are only available for https, NOT http
JAM_SESSION_COOKIE_SECURE=false

# If true, server trusts first reverse proxy like nginx
JAM_SESSION_TRUST_PROXY=false

# Max Age for a valid session cookie (set 0 for no expiration)
JAM_SESSION_MAXAGE=1 day

# DB to use: "postgres" 
# or: "sqlite" (does not support multiuser, so only use it for testing/development)
JAM_DB_DIALECT=sqlite

# Database name
JAM_DB_NAME=jam

# Database user
JAM_DB_USER=jam

# Database user password
JAM_DB_PASSWORD=jam

# Datebase Unix Socket Path to connect (or use host/port)
# NOT the socket itself /var/run/postgresql/.s.PGSQL.5432
JAM_DB_SOCKET=/var/run/postgresql/

# Datebase Host
JAM_DB_HOST=127.0.0.1

# Datebase Port
JAM_DB_PORT=5432

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
    /*
      Since the default admin password is stored in clear in this file,
      you MUST change it on first login
    */
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

`npm run build` to build the server into dist/

### Production Build

`npm run build:prod` to clean & build the server into dist/

### Develop Full

`npm run develop` to run the server & rebuild/reload on source file changes

### Develop Quick

run via tsnode which is faster, but nodejs worker_threads will not be used

`npm run develop:tsnode` to run the server & rebuild/reload on source file changes

### Clean Dist

`npm run clean` to clean up the distribution folder

### Test

`npm run test` to run all tests

### Test Coverage

`npm run coverage` to run all tests & generate a coverage report
