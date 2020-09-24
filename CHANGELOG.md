# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.4.5](https://github.com/ffalt/jamserve/compare/v0.4.4...v0.4.5) (2020-09-24)


### Bug Fixes

* **db schema:** remove old genres columns ([1723063](https://github.com/ffalt/jamserve/commit/17230636b65b90e54e196a422411c9f8625e1845))

### [0.4.4](https://github.com/ffalt/jamserve/compare/v0.4.3...v0.4.4) (2020-09-24)


### Features

* **podcast:** add podcast discover api via gpodder.net ([6e48521](https://github.com/ffalt/jamserve/commit/6e48521762f9b126bd9ff0228652b13d4aee67e0))


### Bug Fixes

* **Content Security Policy:** disallow objectSrc, register csp-violation endpoint ([0c4a630](https://github.com/ffalt/jamserve/commit/0c4a630eb5e47977de101f8ed8322314b214b922))
* **Content Security Policy:** register csp-violation endpoint after log ([fbef17b](https://github.com/ffalt/jamserve/commit/fbef17b554205b9c18dfc50eabcca952ff092fb8))
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
