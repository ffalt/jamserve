# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.4.11](https://github.com/ffalt/jamserve/compare/v0.4.10...v0.4.11) (2020-12-22)


### Bug Fixes

* **health:** do not report hints for child multialbum folders ([1b1cadc](https://github.com/ffalt/jamserve/commit/1b1cadcfb4a80a6871dd51fd2710c22d7ca08605))
* **meta:** concat url parameter ([6c6d726](https://github.com/ffalt/jamserve/commit/6c6d726a044111ce7e3d143820c3f714846b0af1))
* **worker:** cleanup thumbnails, transcodings on removal or changes ([f9e70d2](https://github.com/ffalt/jamserve/commit/f9e70d211bceb1374f10e7e401e363eabc07d204))

### [0.4.10](https://github.com/ffalt/jamserve/compare/v0.4.9...v0.4.10) (2020-12-21)

### [0.4.9](https://github.com/ffalt/jamserve/compare/v0.4.8...v0.4.9) (2020-12-18)


### Features

* **meta:** proxy coverartarchive to avoid csp violations because of redirects ([574a8b0](https://github.com/ffalt/jamserve/commit/574a8b05f044ca5fbbe92da95b0b082f3245434a))


### Bug Fixes

* **meta:** refresh album name after tag edit ([5ab3d5e](https://github.com/ffalt/jamserve/commit/5ab3d5e8a2149a434cce61e44d1d256528c22177))

### [0.4.8](https://github.com/ffalt/jamserve/compare/v0.4.7...v0.4.8) (2020-12-14)


### Bug Fixes

* **express:** don't send single hardcoded files with express-static ([9a7f54e](https://github.com/ffalt/jamserve/commit/9a7f54edfea019bae4bcfddc06dfdf4f4f08a6db))

### [0.4.7](https://github.com/ffalt/jamserve/compare/v0.4.6...v0.4.7) (2020-12-10)


### Features

* **csp:** add baseUri, formAction & manifestSrc, refactor ([1316470](https://github.com/ffalt/jamserve/commit/1316470cf9f08434d6af9f56745eeb7405c1061a))
* **rate limit:** add login rate limiter with dynamic block duration ([3672fd6](https://github.com/ffalt/jamserve/commit/3672fd6eb7be6195f8a3c628d96e836f484a6fe9))

### [0.4.6](https://github.com/ffalt/jamserve/compare/v0.4.5...v0.4.6) (2020-09-25)


### Features

* **csp:** add worker-src ([86ae322](https://github.com/ffalt/jamserve/commit/86ae32217d179c610a85016375d883b6f59a855a))
* **password hashing:** use bcyrpt ([ac313e7](https://github.com/ffalt/jamserve/commit/ac313e756bc9e51091d8507dab8055f5b6a951d9))
* **password hashing:** use bcyrpt ([3dc0367](https://github.com/ffalt/jamserve/commit/3dc03674f27b70f8d356bcdac735bda0bd99105b))


### Bug Fixes

* **podcast:** do not httpsify feed urls ([0db9863](https://github.com/ffalt/jamserve/commit/0db986397b34237222aa4fb0bdc924007257b297))
* **redoc:** disable search, since it requires loading a worker via blob: (forbidden by csp) ([773dedb](https://github.com/ffalt/jamserve/commit/773dedbfb479bcdf16840d0af24c39930d0a4bde))
* **scan:** updating must flush changes in smaller transactions ([1a43108](https://github.com/ffalt/jamserve/commit/1a431083beb290d88cd4d64f14779d119aa1c17f))

### [0.4.5](https://github.com/ffalt/jamserve/compare/v0.4.4...v0.4.5) (2020-09-24)


### Bug Fixes

* **csp:** disallow everthing on default-src; allow 'data:' on media-src ([b558402](https://github.com/ffalt/jamserve/commit/b558402a9f70e66ff4fda61cf6406adc79f6cff5))
* **csp:** parse content security protection json ([37ed73c](https://github.com/ffalt/jamserve/commit/37ed73ce43307f9cbed45e14f81900816b49e237))
* **scan:** refreshMeta must not include tracks from other roots ([7d3d587](https://github.com/ffalt/jamserve/commit/7d3d587f4ce00f4d569b930d3a14328ea6851b5c))
* **scan:** update track if already in change list (added by forced rescanning) ([71dd383](https://github.com/ffalt/jamserve/commit/71dd383eb203f555bbd548689f986d5e70546dc7))

### [0.4.4](https://github.com/ffalt/jamserve/compare/v0.4.3...v0.4.4) (2020-09-24)


### Features

* **podcast:** add podcast discover api via gpodder.net ([6e48521](https://github.com/ffalt/jamserve/commit/6e48521762f9b126bd9ff0228652b13d4aee67e0))


### Bug Fixes

* **Content Security Policy:** disallow objectSrc, register csp-violation endpoint ([0c4a630](https://github.com/ffalt/jamserve/commit/0c4a630eb5e47977de101f8ed8322314b214b922))
* **Content Security Policy:** register csp-violation endpoint after log ([fbef17b](https://github.com/ffalt/jamserve/commit/fbef17b554205b9c18dfc50eabcca952ff092fb8))
* **db schema:** remove old genres columns ([aa855c6](https://github.com/ffalt/jamserve/commit/aa855c67d90c72ba18108ecd9a2d6bd35e34891a))
* **db schema:** remove old genres columns ([1723063](https://github.com/ffalt/jamserve/commit/17230636b65b90e54e196a422411c9f8625e1845))
* **rescan:** force track meta update on version change ([1e2cf98](https://github.com/ffalt/jamserve/commit/1e2cf9865c2ccf58169aa23795e6b0a118347e5f))

### [0.4.3](https://github.com/ffalt/jamserve/compare/v0.4.2...v0.4.3) (2020-09-23)


### Bug Fixes

* **Content Security Policy:** allow frontend to connect to wikipedia/wikimedia/coverartarchive/gpodder ([977fc46](https://github.com/ffalt/jamserve/commit/977fc4665c67c55182e5cf820b1161964e0ab957))

### [0.4.2](https://github.com/ffalt/jamserve/compare/v0.4.1...v0.4.2) (2020-09-22)


### ⚠ BREAKING CHANGES

* **genre:** Api version update (Genre objects, Genre Api endpoints)

### Features

* **genre:** collect genres and assign ids, with full JamObject features (fav/played/etc) & image ([a4ac3b0](https://github.com/ffalt/jamserve/commit/a4ac3b06d1e19b8f9b589f4ac90fa9dcdbfd740d))


### Bug Fixes

* **list:** apply sorting to result obj list ([b05cd99](https://github.com/ffalt/jamserve/commit/b05cd99d11538cc1c1be8725fee7a7386047f523))

### [0.4.1](https://github.com/ffalt/jamserve/compare/v0.4.0...v0.4.1) (2020-09-19)


### Bug Fixes

* **state:** played is an integer, not date ([3da8f07](https://github.com/ffalt/jamserve/commit/3da8f070118e380970caed412ff358a13609c787))

## 0.4.0 (2020-09-17)

Start using standard-version changelog
