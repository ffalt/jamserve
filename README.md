# Jamserve Audio Server

An audio library server written in TypeScript for Node.js

[![Test](https://github.com/ffalt/jamserve/workflows/test/badge.svg)](https://github.com/ffalt/jamserve/actions?query=workflow%3Atest)
[![Maintainability](https://qlty.sh/gh/ffalt/projects/jamserve/maintainability.svg)](https://qlty.sh/gh/ffalt/projects/jamserve)
[![Code Coverage](https://qlty.sh/gh/ffalt/projects/jamserve/coverage.svg)](https://qlty.sh/gh/ffalt/projects/jamserve)

## Preamble

This is my long-term pet project to manage, stream, and edit my own music collection.
It's a work in progress and probably always will be.

This is the backend development repository. See:

[Jamberry](https://github.com/ffalt/jamberry) for web client development.

[Jampacked](https://github.com/ffalt/jampacked) for mobile app development.

[Jam-Dockerimage](https://github.com/ffalt/jam-dockerimage) Docker image for JamServe & Jamberry.

[Jam-Docker](https://github.com/ffalt/jam-docker) Run JamServe & Jamberry with Docker.

Features:

* REST & GraphQL API for media scanning, streaming, transcoding, MP3 ID3v2 editing, and user management
* API specs and documentation with OpenAPI - see [JamAPI](https://editor.swagger.io/?url=https://raw.githubusercontent.com/ffalt/jamserve/main/specs/jam.openapi.json)
* Enhanced metadata via MusicBrainz, Last.fm, Wikipedia, Lyrics.ovh, LRCLib, and AcoustID
* Database support for [PostgreSQL](https://www.postgresql.org/) and SQLite for local development

## Requirements

* Install [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/)

* Install [FFmpeg](https://ffmpeg.org/)

    `apt-get install ffmpeg`

    Manual installation: available in PATH or via [environment variables](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg#ffmpeg-and-ffprobe): FFPROBE_PATH and FFMPEG_PATH

Optional for metadata matching and MP3 repair support:

* Install [fpcalc](https://github.com/acoustid/chromaprint/releases/)

    `apt-get install libchromaprint-tools`

    Manual installation: available in PATH or environment variable FPCALC_PATH

* Install [mp3val](http://mp3val.sourceforge.net/)

    `apt-get install mp3val`

    Manual installation: available in PATH or environment variable MP3VAL_PATH

* Install [FLAC](https://xiph.org/flac/)

    `apt-get install flac`

    Manual installation: available in PATH or environment variable FLAC_PATH

## Installation

* Run `npm install` in the root folder of this repository.
* In the `config` folder:
    copy `firststart.config.dist.json` to `firststart.config.json` and
    add an admin user and some media folders (these can be changed at runtime via the frontend UI).
* Set environment variables or create an environment file named `.env`.

## Environment Variables

Example `.env` file for debugging on localhost:

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

## JSON Web Token (JWT) https://jwt.io/

# A unique string for your instance to sign the JWT tokens
JAM_JWT_SECRET=keyboard cat is stomping

# Max age for a valid JWT (set 0 for no expiration)
# Possible values: 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute'
JAM_JWT_MAXAGE=1 day


## Login: Cookie Session

# Due to CORS security, you MUST list all domains where login with a session cookie is allowed
# https://de.wikipedia.org/wiki/Cross-Origin_Resource_Sharing
# (Background: random sites cannot access/create cookies for your domain)
JAM_ALLOWED_COOKIE_DOMAINS=http://localhost:4040,http://localhost:4200

# A unique string for your instance to sign the session cookie (change it!)
# http://www.senchalabs.org/connect/session.html
JAM_SESSION_SECRET=keyboard cat is dancing

# If true, session cookies are only available over HTTPS; not HTTP
JAM_SESSION_COOKIE_SECURE=false

# If true, the server trusts the first reverse proxy (e.g., Nginx)
JAM_SESSION_TRUST_PROXY=false

# Max age for a valid session cookie (set 0 for no expiration)
JAM_SESSION_MAXAGE=1 day

# Database to use: "postgres"
# or: "sqlite" (does not support multi-user, so only use it for testing/development)
JAM_DB_DIALECT=sqlite

# Database name
JAM_DB_NAME=jam

# Database user
JAM_DB_USER=jam

# Database user password
JAM_DB_PASSWORD=jam

# Database Unix socket path to connect (or use host/port)
# NOT the socket itself /var/run/postgresql/.s.PGSQL.5432
JAM_DB_SOCKET=/var/run/postgresql/

# Database host
JAM_DB_HOST=127.0.0.1

# Database port
JAM_DB_PORT=5432

```

Example **config/firststart.config.json**:

```json5
/*
  Add admin user and media folders on first start
 */
{
  /*
    Default admin user
  */
  "adminUser": {
    "name": "admin",
    /*
      Since the default admin password is stored in clear text in this file,
      you MUST change it on first login
    */
    "pass": "your admin password"
  },
  /*
    Default media folders
    Scan strategies:
    'auto' -- try to figure it out
    'artistalbum' -- artist/album folder structure
    'compilation' -- collection of compilation folders
    'audiobook' -- collection of audiobook folders
   */
  "roots": [
    {"name": "Music", "path": "path/to/music", "strategy": "auto"},
    {"name": "Compilations", "path": "path/to/compilations", "strategy": "compilation"},
    {"name": "Soundtracks", "path": "path/to/soundtracks", "strategy": "compilation"},
    {"name": "Audiobooks", "path": "path/to/audiobooks", "strategy": "audiobook"}
  ]
}
```

## Commands

### Start

`npm run start` to run the server (available after a successful build).

### Development Build

`npm run build` to build the server into dist/.

### Production Build

`npm run build:prod` to clean & build the server into dist/.

### Develop Full

`npm run develop` to run the server & rebuild/reload on source file changes.

### Clean Dist

`npm run clean` to clean up the distribution folder.

### Test

`npm run test` to run all tests.

### Test Coverage

`npm run coverage` to run all tests & generate a coverage report.
