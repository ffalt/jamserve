# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [0.6.3](https://github.com/ffalt/jamserve/compare/v0.6.2...v0.6.3) (2026-02-28)


### Features

* **auth:** trim and limit client identifier length in session results ([042e58e](https://github.com/ffalt/jamserve/commit/042e58ed001b10c79ec5355557fe76f417164735))
* **auth:** trim whitespace from passwords during authentication and validation ([4e96598](https://github.com/ffalt/jamserve/commit/4e965980c212a70a04abc1aa51d631e0f39dd6f2))
* **auth:** unify credential error handling and add dummy hash for timing attack prevention ([1f20f72](https://github.com/ffalt/jamserve/commit/1f20f728e707c33ad67b0d6b4ae3bc0b0062b139))
* **compress:** update contentType and Content-Disposition headers based on format ([07cb879](https://github.com/ffalt/jamserve/commit/07cb8792b1f13c40d8b5e4102a0167ead6806bf3))
* **config:** filter out empty domains from allowedCookieDomains ([466e709](https://github.com/ffalt/jamserve/commit/466e7090182d2d218f889b229cb67d941e573e4a))
* **config:** update third-party API keys to use environment variables ([b0bb1ba](https://github.com/ffalt/jamserve/commit/b0bb1ba9ec802e713edb3e20b95eaec767010d36))
* **download:** add max size limit for downloads and handle oversized responses ([d36036a](https://github.com/ffalt/jamserve/commit/d36036abff1ecbea23817fce2d27bccec27feebe))
* **folder:** add roles requirement for remove folder endpoint ([fd4812d](https://github.com/ffalt/jamserve/commit/fd4812d93bd6101633548ded686fe2a1cb2a18f9))
* **image:** add external URL validation in storeImage method ([15419b1](https://github.com/ffalt/jamserve/commit/15419b135ba0bb6b17bf6c1097dcac6b85c38ed7))
* **image:** add external URL validation in storeImage method ([1fee0c5](https://github.com/ffalt/jamserve/commit/1fee0c54131b0420836ed38be690eaf85edb3881))
* **random:** replace Math.random with crypto.randomInt for improved randomness ([8bd7ace](https://github.com/ffalt/jamserve/commit/8bd7ace70b4d5def07fdb05938c3a13ed6275d78))
* **session:** optimize jwthCache management using Set for improved performance ([493234d](https://github.com/ffalt/jamserve/commit/493234d38e01c0c27975a79040cc44b2509480bf))
* **subsonic:** enable credentials in CORS headers for allowed origins ([076dccf](https://github.com/ffalt/jamserve/commit/076dccf6f522c175a76fc59d45429b8dfa3e5148))
* **tsconfig:** update module and moduleResolution for Jest compatibility ([e62141c](https://github.com/ffalt/jamserve/commit/e62141c1b2c5b1d4eeb219ed34a90142caf29185))
* **url-validation:** add external URL validation to fetch and download functions ([b39963a](https://github.com/ffalt/jamserve/commit/b39963a2fadf3d3feca6cc594d55b4d6fbf80c56))
* **url-validation:** add external URL validation to fetch and download functions ([7e1c369](https://github.com/ffalt/jamserve/commit/7e1c369ebba44823e72ee63bffb2671cfef4877e))


### Bug Fixes

* **apollo:** enhance error logging and sanitization in production ([64125df](https://github.com/ffalt/jamserve/commit/64125df06d4df6bc44ed8afc64bcd382f447dea8))
* **artwork:** ensure stable sorting of artwork types by creating a copy of the array ([9c3c456](https://github.com/ffalt/jamserve/commit/9c3c45626fca98aaf09553712628a26b23564238))
* **auth:** handle rate limiting error in authentication ([758efab](https://github.com/ffalt/jamserve/commit/758efab7fcefdad3560201151c032625f730d5bc))
* **auth:** reject login attempts when rate limited ([ea59d2b](https://github.com/ffalt/jamserve/commit/ea59d2bdfc4f99533e70602f23ca914c506186bd))
* **auth:** revoke JWT token on logout for improved session management ([5f66271](https://github.com/ffalt/jamserve/commit/5f6627182b897afd618906f9e8a5eda770e4cade))
* **clients:** enhance error handling for zip archive creation ([5dd91b2](https://github.com/ffalt/jamserve/commit/5dd91b2966436e8aafd93fcc34fe5d4edff3b961))
* **clients:** improve array handling and correct type string formatting ([a07a64d](https://github.com/ffalt/jamserve/commit/a07a64d56d000c3ecf42f9b81cf6c8be566e6bff))
* **clients:** remove password handling from login method and adjust request building ([2592b60](https://github.com/ffalt/jamserve/commit/2592b6011ba864f8fe736038ed44273e454659ae))
* **clients:** sanitize filename in Content-Disposition header for zip downloads ([55d372a](https://github.com/ffalt/jamserve/commit/55d372a8d29274917fe44b7f8731dff6c1d0ab12))
* **code quality:** correct spelling of 'graphql' and 'fileExtension' in multiple files ([db59895](https://github.com/ffalt/jamserve/commit/db59895a7e65850d6be529e214e4ec69cb39983a))
* **collection:** optimize filtering logic for removed items ([38f167a](https://github.com/ffalt/jamserve/commit/38f167a4cbe27039a5c5f4e1ad72a3e9c3a2785d))
* **compress-base-stream:** improve error handling during archive creation ([910d349](https://github.com/ffalt/jamserve/commit/910d34992f606b58e991da3bc1b5c711c3ede625))
* **compress:** log archive errors and destroy stream on failure ([4a6c974](https://github.com/ffalt/jamserve/commit/4a6c97482e8921aa9cb2d58436efdbda74940201))
* **config.service, max-age:** enhance getMaxAge function to accept a default max-age value and add ONE_YEAR_MS constant ([ef4dace](https://github.com/ffalt/jamserve/commit/ef4dace9a9a397f8838e24a8cc24f6417d0e9fd7))
* **config.service:** enforce stronger secret length and variation requirements ([6d3c01c](https://github.com/ffalt/jamserve/commit/6d3c01ce3de7fc3e01a1cebd7fb5a4cb362148a0))
* **config:** refactor secret validation logic, validate session & jwt secrets ([f51aad5](https://github.com/ffalt/jamserve/commit/f51aad5034e5c1ae5503529853ff5f01e211352e))
* **config:** set third-party API keys from environment variables during config initialization ([6c02b7d](https://github.com/ffalt/jamserve/commit/6c02b7df21ec55833ad04dab29b03ee2bcab98bc))
* **config:** update rate limits and add session secret validation ([8e7b4bf](https://github.com/ffalt/jamserve/commit/8e7b4bff7d4a3dde47317297541faf906e65b71b))
* **config:** validate session cookie secure flag and update README for clarity ([b1fa42f](https://github.com/ffalt/jamserve/commit/b1fa42fa86a505bc7149c05cf0f8e45f8bfc8693))
* **cors:** Only allow whitelisted origins - strict CORS policy ([d136dd8](https://github.com/ffalt/jamserve/commit/d136dd8599a90e6a90e830f6fbcfb77f0c1b8a3e))
* **dir-name:** enhance folder name validation with detailed error messages ([26dea19](https://github.com/ffalt/jamserve/commit/26dea1909b67bd1f29bbd18df1de832d4bf903f2))
* **download:** handle bad file stream by destroying the destination ([1512c6d](https://github.com/ffalt/jamserve/commit/1512c6d8cdca3f6d307c11f77d6ad38359e8e748))
* **episode:** improve error handling by using errorToString utility ([324d84a](https://github.com/ffalt/jamserve/commit/324d84a3feb512ac95932b90ff4634afd8b0d553))
* **express-responder:** enhance JSONP callback validation to prevent XSS and prototype pollution ([0aff892](https://github.com/ffalt/jamserve/commit/0aff89261712b96e98777f00a02314044d3c0c6e))
* **express-responder:** refactor JSONP callback validation to use utility function for improved security ([f7bc612](https://github.com/ffalt/jamserve/commit/f7bc612066c4e4aedad07a651385d12053c6525b))
* **express-responder:** set charset for XML response content type ([7fd27bb](https://github.com/ffalt/jamserve/commit/7fd27bb9f981a987f0dea84243b1251650bc5bf5))
* **express:** ensure parameters are sorted without mutating the original array ([3b1fa73](https://github.com/ffalt/jamserve/commit/3b1fa738f1b7754c2ff19c646434550f6f4a711e))
* **express:** improve error handling during file cleanup on validation failure ([e11abdb](https://github.com/ffalt/jamserve/commit/e11abdb561fd1c504caeada5910aba81a3469b6a))
* **express:** validate callback parameter in sendJSONP to prevent XSS ([e3957d4](https://github.com/ffalt/jamserve/commit/e3957d4533ce4cd9994bbdf360ed4ff16ab4c9e6))
* **fetch:** set request timeout to 30s using AbortSignal in podcast-feed and webservice-client ([482e14d](https://github.com/ffalt/jamserve/commit/482e14de33c8ca6ee9305e172e18380228af85f9))
* **ffmpeg:** log unhandled errors when no error listener is attached ([632bb25](https://github.com/ffalt/jamserve/commit/632bb25517f8e664ed2932d4e97e64642a7374a3))
* **folder:** prevent mutation of the original list when sorting folders ([3da5f52](https://github.com/ffalt/jamserve/commit/3da5f5232e0f3d2d4cf6d309940952fecac99154))
* **folder:** replace string replacement with replaceAll for path updates ([048ec73](https://github.com/ffalt/jamserve/commit/048ec73f27ed84a17ad365d956a3f2a58783f28d))
* **hexDecode:** enhance input validation and add unit tests for hex decoding ([ca8d0fb](https://github.com/ffalt/jamserve/commit/ca8d0fb3a51986f15b52776b9205d00d50db549d))
* **image.module:** enhance image download process with format verification and error handling ([03d8674](https://github.com/ffalt/jamserve/commit/03d867458a68f2a1dfdca5c8c7e38d6caf2fe9d0))
* **image:** provide default values for image metadata to handle corrupt images ([b93ff37](https://github.com/ffalt/jamserve/commit/b93ff3731fd36ac5c957560951920808b92c7bc1))
* **image:** validate supported image formats before processing ([dd258f3](https://github.com/ffalt/jamserve/commit/dd258f32bb217d7c347b1b7669beac58f88e9815))
* **io.service:** implement history management for command execution with error logging ([e567089](https://github.com/ffalt/jamserve/commit/e5670898c990a7f02b33cb203359aa1c1cdd384e))
* **jwt:** specify HS256 algorithm for JWT signing and verification ([c93c689](https://github.com/ffalt/jamserve/commit/c93c6898bc9e4a4c7c09592ff687a80d82af8e62))
* **logging:** replace console.error with logger for consistent error handling across modules ([a829b9f](https://github.com/ffalt/jamserve/commit/a829b9f832d1e1d2d7839380f7fee168046c2983))
* **login:** add error handling for failed user login attempts ([c328f77](https://github.com/ffalt/jamserve/commit/c328f7771234fd1f983dba2e48b0302258e94a33))
* **metadata:** correct album info retrieval logic to handle cases with no releases ([36dff2c](https://github.com/ffalt/jamserve/commit/36dff2c86583f0752356a785eba357c1de2e5ede))
* **metadata:** correct composerSort property name to match schema ([b732702](https://github.com/ffalt/jamserve/commit/b73270283b44dbd3993eb479a4c8c1133e2e230b))
* **metadata:** update lastFMSimilarTracksSearch to return similar tracks instead of album info ([2a5bb67](https://github.com/ffalt/jamserve/commit/2a5bb6781b5a89f918d12df2ad903b19041f6d42))
* **middleware:** escape user name for safe embedding in script block ([b20948f](https://github.com/ffalt/jamserve/commit/b20948fd1e205357d3610e6de3c9cfe9325bfa0b))
* **middleware:** remove redundant bodyParser.json configuration ([111b7c0](https://github.com/ffalt/jamserve/commit/111b7c0876c76856f92448cd976e62cbfa03a503))
* **middleware:** update authentication token handling to ensure proper JSON formatting ([2b47c2f](https://github.com/ffalt/jamserve/commit/2b47c2fd69d7d99ae57f98b60e3342d21c2adbd6))
* **mp3:** enhance error handling by posting error messages to caller ([04b584e](https://github.com/ffalt/jamserve/commit/04b584e0d14b9cacdcb85f32a4e6fd7e0d6e0496))
* **mp3:** improve error handling by posting error messages to caller ([22e8669](https://github.com/ffalt/jamserve/commit/22e86691087c4ebe130a60afba7b00cfcda3a9b6))
* **mp3val:** adjust index handling for string slicing to improve data extraction ([492bf5c](https://github.com/ffalt/jamserve/commit/492bf5cbb5396192efca3bec060a757fb2b33dd3))
* **musicbrainz:** encode query parameters for safe URL construction ([6402031](https://github.com/ffalt/jamserve/commit/6402031b94c5eb53c509abff7c1c11ac1c59200f))
* **nowplaying.service:** implement stale entry pruning in getNowPlaying and report methods ([abbe1a3](https://github.com/ffalt/jamserve/commit/abbe1a31736b607b08434a82269180f7b6c988b1))
* **openapi:** update security scopes from 'stream' to 'admin' for cookieAuth and bearerAuth ([ca7c011](https://github.com/ffalt/jamserve/commit/ca7c01100d86b616fd077f17310bb66c3937bd8a))
* **parameters:** limit callback query parameter length to 128 characters ([c8db788](https://github.com/ffalt/jamserve/commit/c8db788623fe5faadf9a48b5cf8e0f8f62fc8a87))
* **passport:** enhance error handling by logging errors and passing them to next middleware ([50b254e](https://github.com/ffalt/jamserve/commit/50b254e3dea3d28eb034ce5b0851b1fa3c32e83c))
* **passport:** Removed jwt-parameter strategy - only support Authorization header, JWT tokens in query parameters are a security risk (leaked in logs, browser history, proxies) ([20ab3de](https://github.com/ffalt/jamserve/commit/20ab3de143008761d547e05f744a9cbd4a00afe9))
* **passport:** simplify login flow by removing rate limit handling ([92fed34](https://github.com/ffalt/jamserve/commit/92fed348238e5abc5dd2a1a33c22f50783640b81))
* **processor:** move 'done' event emission to _flush method for better error handling ([b12296d](https://github.com/ffalt/jamserve/commit/b12296d9be186bc43d621bceb0f8321bf7fcf504))
* **query:** enhance LIKE clause handling with escape function for user input ([80da6a3](https://github.com/ffalt/jamserve/commit/80da6a3496582d4e6efb7a90444609b038994a6f))
* **random:** optimize random selection algorithm for improved performance ([008f072](https://github.com/ffalt/jamserve/commit/008f072e0eba400ef0b9deb866bdb780c08fe62f))
* **rate-limit:** add rate limiting for API and Subsonic endpoints to enhance performance and prevent abuse ([93b9522](https://github.com/ffalt/jamserve/commit/93b952256e7d030c5697ac1e3843197e0ca536d9))
* **ratelimit:** cap maximum block duration to 96 hours for shared IPs ([9a0d708](https://github.com/ffalt/jamserve/commit/9a0d708b8c892276a012038f1edb5e738c9050f6))
* **ratelimit:** handle undefined IP addresses by using 'unknown' as fallback ([38702e7](https://github.com/ffalt/jamserve/commit/38702e7a2060dcc5a85dd08e7c0d781e2d612dea))
* **rateLimits:** increase frontend request limit to 2000 per window ([c24c833](https://github.com/ffalt/jamserve/commit/c24c83364f8d20f1b84935aeef04686b17270536))
* **responder:** sanitize filenames in Content-Disposition headers to prevent header injection ([0385c8a](https://github.com/ffalt/jamserve/commit/0385c8a3c734a1e7e411b76ccb3e1236434d68b9))
* **response:** enhance error logging for unhandled API errors ([ff31b56](https://github.com/ffalt/jamserve/commit/ff31b56ab5b33f8b0f3e916c484c5077d4024d60))
* **response:** implement dynamic CORS headers to enhance security and prevent credential exposure ([d63ab2c](https://github.com/ffalt/jamserve/commit/d63ab2cfffbe13b6edfdfba0fb43bd4505c2b871))
* **root.service:** correct folder sorting logic in getImage method ([61c9f5d](https://github.com/ffalt/jamserve/commit/61c9f5de8e8e3b24573a0af54ae98984acf796d5))
* **root:** add deny-list for sensitive system paths in root path validation ([f00a80e](https://github.com/ffalt/jamserve/commit/f00a80ef41d38b6eeb4c484eccca11d9bd1afb07))
* **root:** remove '/tmp' from sensitive root directories list ([26aedf8](https://github.com/ffalt/jamserve/commit/26aedf85f1e2f6e9cfa5659af9959f8d8b2a2948))
* **scan-dir:** add recursion depth limit to prevent stack overflow ([f624e3e](https://github.com/ffalt/jamserve/commit/f624e3e9f02f198fc2e2870c496941baad39a9d9))
* **server:** add global error handler for unhandled errors ([2568842](https://github.com/ffalt/jamserve/commit/2568842a7152c48719aaa25c0aba7b31181fef2a))
* **server:** return default value for domain in getDomain method ([e6cae22](https://github.com/ffalt/jamserve/commit/e6cae22e2b88259cc348dedf008b61bae8b53391))
* **server:** set trust proxy to only the first proxy hop ([307eded](https://github.com/ffalt/jamserve/commit/307ededeeafaf5e0a12d8f632d7de09e1a1a8125))
* **services.test:** replace custom random string generation with secure utility ([b5cf4c6](https://github.com/ffalt/jamserve/commit/b5cf4c61bfba9b5425272726cbc07c90e586a1b7))
* **session-store:** handle undefined cookie expiration to support session-lifetime cookies ([b998a52](https://github.com/ffalt/jamserve/commit/b998a524084d16144de0c28c9d0cf9b73a9c9143))
* **session-store:** implement LRU cache eviction for session management ([180b182](https://github.com/ffalt/jamserve/commit/180b18224cc3f89110896c0c1f234e1e30b6135c))
* **session:** enhance security by adding httpOnly and sameSite attributes to session cookies ([b57f357](https://github.com/ffalt/jamserve/commit/b57f357b1f470ae8d3f3751a00abb46ce9cd6d75))
* **session:** improve session removal by deleting JWTH from cache ([0c65ccc](https://github.com/ffalt/jamserve/commit/0c65cccf588628b6327d5630f1dcfbd9adc343ba))
* **session:** increase JWT length for enhanced security ([2a31af0](https://github.com/ffalt/jamserve/commit/2a31af00b3533eeb99eee5461b77fc8ac8c15cbf))
* **session:** set default maxAge for session cookies to 1 year ([2832aa0](https://github.com/ffalt/jamserve/commit/2832aa0d4d3f9af18e0dd5850858a81c130f0c53))
* **settings.service:** add error handling for invalid JSON in settings data ([7e58e28](https://github.com/ffalt/jamserve/commit/7e58e2879a304dba99b49655feae7126fb6166f8))
* **stats-builder:** correct assignment of stat object to ensure accurate counting ([66a6f17](https://github.com/ffalt/jamserve/commit/66a6f17bc410ad690693aaa3fb01e4a1c80ab9e2))
* **tool:** enhance error handling in tool execution ([22c2084](https://github.com/ffalt/jamserve/commit/22c2084fc3f913aeca9c1f94619079878fee3f85))
* **track:** correct property assignment for FLAC media validation rule ([c27c6db](https://github.com/ffalt/jamserve/commit/c27c6db11d4bd03119709d0a0a4aa8126bbf7603))
* **transcoder-stream:** update webm audio processing to specify codec and bitrate ([3599330](https://github.com/ffalt/jamserve/commit/359933055ed7da40fd0e05a68d5f9eaa78fd8c79))
* **upload:** add file type validation and size limit for uploaded images ([c28ca11](https://github.com/ffalt/jamserve/commit/c28ca1177bcb8daf66ba8e06a938da756bfd1ea5))
* **url-check:** ensure correct unsigned comparison for IPv4 addresses ([c8161e5](https://github.com/ffalt/jamserve/commit/c8161e55ab3dbb7ccf260b4d73f787789253ac96))
* **url-check:** improve readability of blocked IPv4 check ([c8f1bab](https://github.com/ffalt/jamserve/commit/c8f1baba62225b99e03385ba13fb887bad090772))
* **url-check:** throw error for empty or whitespace-only URLs and update tests for invalid input handling ([0fa98a2](https://github.com/ffalt/jamserve/commit/0fa98a27364062189b787d2515ceb5066c58243a))
* **user-service:** add email format validation in setUserEmail method ([9752810](https://github.com/ffalt/jamserve/commit/97528104e136bd16893c22e587ef2526bc07992a))
* **user.service:** enhance password comparison to prevent timing attacks ([5457756](https://github.com/ffalt/jamserve/commit/545775656e7cbe0014923de7d7c39563b31fd687))
* **user:** enhance password comparison using timingSafeEqual to prevent timing attacks ([8e6ab81](https://github.com/ffalt/jamserve/commit/8e6ab81e6e5a40f0f7b2da81d6c42fe31aca4561))
* **user:** update password validation to use configurable minimum length and improve timing-safe comparison ([a8fb56f](https://github.com/ffalt/jamserve/commit/a8fb56ff7c982d1dd8051d74618e765221b203e7))
* **wikipedia-client:** validate and sanitize language codes for API requests ([9f51250](https://github.com/ffalt/jamserve/commit/9f512507395790214ac862b11600c67523a1b4a4))

## [0.6.2](https://github.com/ffalt/jamserve/compare/v0.6.1...v0.6.2) (2026-01-15)


### Features

* **audio:** support m4b format extension ([c0a21dd](https://github.com/ffalt/jamserve/commit/c0a21dd9a6d81cfa01f09d3bfd7174ff07ed2259))

## [0.6.1](https://github.com/ffalt/jamserve/compare/v0.6.0...v0.6.1) (2025-12-07)

## [0.6.0](https://github.com/ffalt/jamserve/compare/v0.5.26...v0.6.0) (2025-09-27)

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
