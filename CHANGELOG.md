# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [0.5.26](https://github.com/ffalt/jamserve/compare/v0.5.25...v0.5.26) (2025-07-01)

* **deps:** update

## [0.5.25](https://github.com/ffalt/jamserve/compare/v0.5.24...v0.5.25) (2025-06-06)

### Features

* **lyrics:** add support for lrclib ([59862d4](https://github.com/ffalt/jamserve/commit/59862d4cca67a79b7b68e176ca87878e02511ee4))

### Bug Fixes

* package.json & package-lock.json to reduce vulnerabilities ([40373ff](https://github.com/ffalt/jamserve/commit/40373ff76032a2fdf8283393b61058417b8ebf70))

## [0.5.24](https://github.com/ffalt/jamserve/compare/v0.5.23...v0.5.24) (2024-10-07)

### Features

* **subsonic:** load synced lyrics from id3 tags ([9adfb18](https://github.com/ffalt/jamserve/commit/9adfb18280efb5edba28681167576d14d2008e57))

## [0.5.23](https://github.com/ffalt/jamserve/compare/v0.5.22...v0.5.23) (2024-10-07)

### Features

* **api:** prepare support for timeOffset in streaming calls ([3eaac00](https://github.com/ffalt/jamserve/commit/3eaac004a91203e668563c82952a4dcbbd07355f))
* **api:** support subsonic/opensubsonic api and extensions ([d268ec1](https://github.com/ffalt/jamserve/commit/d268ec188547fcee1340a0c68f58db2baf564835))
* **logging:** add rotation log file writing ([421bba6](https://github.com/ffalt/jamserve/commit/421bba6910dc65ad363e47b4f4fbd2c6bfde1814))
* **ratelimit:** add limits for doc file requests ([9c23a81](https://github.com/ffalt/jamserve/commit/9c23a81a9fdbf305e67bf1e3e39a32bb57516484))
* **ratelimit:** add limits for frontend file requests ([0a1504f](https://github.com/ffalt/jamserve/commit/0a1504fc243594980aec592c16b2d2cf6c45aa1c))

### Bug Fixes

* **graphql:** use integer instead of float ([aa4f4ef](https://github.com/ffalt/jamserve/commit/aa4f4eff6a2234e503d4d861215271cc61fb402a))

## [0.5.22](https://github.com/ffalt/jamserve/compare/v0.5.21...v0.5.22) (2024-10-01)

## [0.5.21](https://github.com/ffalt/jamserve/compare/v0.5.20...v0.5.21) (2024-09-13)

## [0.5.20](https://github.com/ffalt/jamserve/compare/v0.5.19...v0.5.20) (2024-03-23)

### Bug Fixes

* **test:** adjust to deps bump ([5c8ccd7](https://github.com/ffalt/jamserve/commit/5c8ccd7f9eb145e879c9ec5b52b09b2e09f1fb86))

## [0.5.19](https://github.com/ffalt/jamserve/compare/v0.5.18...v0.5.19) (2023-11-17)

### Bug Fixes

* **healthcheck:** disable id3v1 removal hint ([ede9f16](https://github.com/ffalt/jamserve/commit/ede9f16c64114abc279ea1a891ccd67c91952b78))
* **types:** timeout node type ([70a236d](https://github.com/ffalt/jamserve/commit/70a236d1932ef7a76150f3ab2d263c21bd1b19f8))

## [0.5.18](https://github.com/ffalt/jamserve/compare/v0.5.17...v0.5.18) (2023-05-20)

### Bug Fixes

* **healthcheck:** repair testing mp3 ([a94406b](https://github.com/ffalt/jamserve/commit/a94406bfc2146c8167e4151ee5e8f7318a1faf83))

## [0.5.17](https://github.com/ffalt/jamserve/compare/v0.5.16...v0.5.17) (2023-05-19)

### Features

* **images:** darken missing image placeholder ([b7f71a2](https://github.com/ffalt/jamserve/commit/b7f71a2e8835e99fc237d99c9aa9cd72ca6ee9a9))

### Bug Fixes

* **graphql:** playlist item media optional by type ([7b5e716](https://github.com/ffalt/jamserve/commit/7b5e716058f6d20ea094e1092b2006c136b7e3b0))
* **track:** like search is query, not name ([cb7419d](https://github.com/ffalt/jamserve/commit/cb7419db23552eae64f68a6dfe52c2426cbfd138))

## [0.5.16](https://github.com/ffalt/jamserve/compare/v0.5.15...v0.5.16) (2023-04-24)

### Bug Fixes

* **soundtracks:** don't register soundtracks with various artists as AlbumType.compilation ([4945f4f](https://github.com/ffalt/jamserve/commit/4945f4fc8b2b91d439fc771318af351f704d2745))

## [0.5.15](https://github.com/ffalt/jamserve/compare/v0.5.14...v0.5.15) (2023-01-24)

### Bug Fixes

* **favorites:** repair list query ([09848d3](https://github.com/ffalt/jamserve/commit/09848d3a391dd6537c7796a1c435e8d08ace2a4f))

### [0.5.14](https://github.com/ffalt/jamserve/compare/v0.5.13...v0.5.14) (2023-01-14)

### Features

* **github action:** use ref_name as release name [skip ci] ([a619137](https://github.com/ffalt/jamserve/commit/a619137c3ce159c736283d82a4b0af8a655ae1ff))

### Bug Fixes

* **nodejs:** include the json data ([a959880](https://github.com/ffalt/jamserve/commit/a959880c07a970f02c53d349107c41615b7c1f0e))

### [0.5.13](https://github.com/ffalt/jamserve/compare/v0.5.12...v0.5.13) (2023-01-14)

### Bug Fixes

* **nodejs:** different requirements for json in different nodejs version, just read it instead of importing/require ([5037d49](https://github.com/ffalt/jamserve/commit/5037d49f3c3e89a1f73eb9c2f496a96ec9d4578b))

### [0.5.12](https://github.com/ffalt/jamserve/compare/v0.5.3...v0.5.12) (2023-01-13)

### Bug Fixes

* **graphql:** add missing playlist-entry.resolver ([a08c3d8](https://github.com/ffalt/jamserve/commit/a08c3d8ff813cf21d0cbca7708818e18fb07eca4))
* **playlist:** allow accessing public playlists of other users by id ([858330f](https://github.com/ffalt/jamserve/commit/858330f52e4eada9fcad42492745fe618d7b07ae))
* **template:** fix type in template ([f80568d](https://github.com/ffalt/jamserve/commit/f80568df05b357e9318208170df0d78264faa7a1))

### [0.5.11](https://github.com/ffalt/jamserve/compare/v0.5.10...v0.5.11) (2022-12-17)

### Features

* **graphql:** update to graphql 16
* **apollo:** update to apollo server 4

### [0.5.10](https://github.com/ffalt/jamserve/compare/v0.5.9...v0.5.10) (2022-12-13)

### Bug Fixes

* **logout:** flush session if .passport does not exist ([61ad6ec](https://github.com/ffalt/jamserve/commit/61ad6ec2fb771b81384633748e042bdc0535a36f))

### [0.5.9](https://github.com/ffalt/jamserve/compare/v0.5.8...v0.5.9) (2022-09-19)

* **deps:** update

### [0.5.8](https://github.com/ffalt/jamserve/compare/v0.5.7...v0.5.8) (2022-03-27)

### Features

* **deps:** fix import ([ffa14fd](https://github.com/ffalt/jamserve/commit/ffa14fde98f2822f6b775025017330b81beeb244))

### Bug Fixes

* **deps:** fix broken import ([5f2c00b](https://github.com/ffalt/jamserve/commit/5f2c00bf1d8c8618f9b600d7926a5e75b77882ff))

### [0.5.7](https://github.com/ffalt/jamserve/compare/v0.5.6...v0.5.7) (2022-03-26)

### Features

* **deps:** bump dependencies ([23ce0e1](https://github.com/ffalt/jamserve/commit/23ce0e1bcff78af1cf65cdac32b8297707ab4b59))
* **deps:** bump dependencies ([b8d24e2](https://github.com/ffalt/jamserve/commit/b8d24e201b1cdf5988ee0fc260d5a41596444deb))
* **deps:** bump dependencies ([afe339c](https://github.com/ffalt/jamserve/commit/afe339c1680adc29520d00f8ad23c11ca10973af))
* **deps:** bump dependencies ([3e2ebd7](https://github.com/ffalt/jamserve/commit/3e2ebd7cf885ea48b45c1835462cfd62ed75e5af))
* **deps:** bump dependencies ([e2496e9](https://github.com/ffalt/jamserve/commit/e2496e94fa8858a29207c892df5ba78bc7ec0c57))
* **deps:** include limiter src until ts/js import is fixed ([1dcf5ef](https://github.com/ffalt/jamserve/commit/1dcf5ef80d3dc51d550869fc8aa72435787033cc))

### [0.5.6](https://github.com/ffalt/jamserve/compare/v0.5.5...v0.5.6) (2022-01-12)

### Features

* **deps:** bump dependencies ([da379ec](https://github.com/ffalt/jamserve/commit/da379ecb36cf39013cfde21a3cd072cb55e889c0))

### Bug Fixes

* **github:** do not cache pull request node_modules ([1b33cf7](https://github.com/ffalt/jamserve/commit/1b33cf769b32ddf3bf17006be494e71fc6f51f92))
* **rest:** nullable empty strings will be null ([9a672b4](https://github.com/ffalt/jamserve/commit/9a672b4a8f89ec032f6bf8af53926ac5298377bc))

### [0.5.5](https://github.com/ffalt/jamserve/compare/v0.5.4...v0.5.5) (2021-10-29)

* **deps:** bump dependencies

### [0.5.4](https://github.com/ffalt/jamserve/compare/v0.5.3...v0.5.4) (2021-10-13)

### Features

* **genres:** add missing genre<=>series relation ([93711ae](https://github.com/ffalt/jamserve/commit/93711aef84623f1988d57b3a9cf23640eba5e39f))
* **genres:** add missing genreID filter ([8917e70](https://github.com/ffalt/jamserve/commit/8917e70cfe14abb0d706e8c3f112538e2f6aaa6b))
* **graphql:** get album/artist/folder extended info ([635042f](https://github.com/ffalt/jamserve/commit/635042fcff56ce2b91b4bb6df71c12e4d434ad8a))

### [0.5.3](https://github.com/ffalt/jamserve/compare/v0.5.2...v0.5.3) (2021-08-06)

### Bug Fixes

* **albumtype:** set various artist albums to albumtype compilation ([3719e37](https://github.com/ffalt/jamserve/commit/3719e37bab5888a72a477eab422d15f4b3bb1cab))
* **album:** update musicbrainzIDs on changes ([396f023](https://github.com/ffalt/jamserve/commit/396f0237fdf6b389eb6b24b22c9136eacaa308e4))
* **genres:** update genres for removed audio files ([094e272](https://github.com/ffalt/jamserve/commit/094e2721feb12862d15ab5106280b747e9e05814))
* **model:** add artist root folder to artist.folders ([2e4ef82](https://github.com/ffalt/jamserve/commit/2e4ef82a012c121b6943942d5987ac44c9bc06c9))
* **track:** update genres on track tag change ([4b1f1ed](https://github.com/ffalt/jamserve/commit/4b1f1eda5ed3c1364f63e1e861cca3b88a24101d))

### [0.5.2](https://github.com/ffalt/jamserve/compare/v0.5.1...v0.5.2) (2021-08-04)

### Bug Fixes

* **api:** image file upload special handling in express ([4af50e8](https://github.com/ffalt/jamserve/commit/4af50e834414a8db0ba9366c67e8ead63dc1115f))
* **changes-worker:** remove states from bookmarks & playlistEntries on delete ([dac43bf](https://github.com/ffalt/jamserve/commit/dac43bfb07d57a4841b3dcd94c82655d969b9ae3))

### [0.5.1](https://github.com/ffalt/jamserve/compare/v0.5.0...v0.5.1) (2021-07-31)

### Bug Fixes

* **image:** placeholder image webp support ([0945bd5](https://github.com/ffalt/jamserve/commit/0945bd5e77a5c0b89a47546e6371c1716bfe1d85))

## [0.5.0](https://github.com/ffalt/jamserve/compare/v0.4.13...v0.5.0) (2021-07-31)

### ⚠ BREAKING CHANGES

* **esm:** "firststart.config.js" is now a json file
  "firststart.config.json"

### Features

* **images:** enable webp format ([065d035](https://github.com/ffalt/jamserve/commit/065d03524ddaf203cf394d156557714b2c45a525))

### Bug Fixes

* **graphql:** add missing resolvers ([cb82cd3](https://github.com/ffalt/jamserve/commit/cb82cd3af1f864606321208e18097869a94e131d))
* **index:** don't fail album index if missing artist bug strikes ([391c43f](https://github.com/ffalt/jamserve/commit/391c43f21c1099725050613f5bab8fe35d4de343))
* **lastfm:** lfm started to answer 404 if data not found instead of empty result ([c4f83c5](https://github.com/ffalt/jamserve/commit/c4f83c5ec528dbf1f1035e556b46fb3bec4476d1))

### build

* **esm:** use esm, fix circular deps issues ([6f88a37](https://github.com/ffalt/jamserve/commit/6f88a378d53388ca686227e60cb445d2d37e768c))

### [0.4.13](https://github.com/ffalt/jamserve/compare/v0.4.12...v0.4.13) (2021-05-16)

### [0.4.12](https://github.com/ffalt/jamserve/compare/v0.4.11...v0.4.12) (2021-04-04)

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
