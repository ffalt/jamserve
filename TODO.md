* API is missing endpoints for administrative activities (e.g. changing options)

* use a dependencies injection system instead of doing it manual https://github.com/nehalist/di-ts

* implement https://de.wikipedia.org/wiki/Dynamic_Adaptive_Streaming_over_HTTP streaming

* add default avatar creation https://github.com/DiceBear/avatars

* get rid of cleartext password storage (needed for subsonic api)

  password MUST be stored in clear text on the server, since md5 auth with salt needs to be generated with it,
the deprecated auth was even worse transmitting the password in clear on every request.
this would only change if subsonic adds a good auth

* get mood & genre data via https://acousticbrainz.org/api/v1/MUSICBRAINZRELEASETRACKID/high-level

