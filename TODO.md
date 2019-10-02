LONG TERM:

*   use a dependencies injection system instead of doing it manual [e.g.](https://github.com/nehalist/di-ts) maybe typescript generator?
*   implement [dynamic streaming](https://de.wikipedia.org/wiki/Dynamic_Adaptive_Streaming_over_HTTP)
*   db schema update on data of older jamserve version
*   search by regex

TODO:

*   Persistent store of lyrics
*   Audio Book/Drama Series handling
*   Upload Audio
*   Slugify values in lyrics search
*   Force Rescan Artists/Albums in Library (missing api)
*   Cache for transcoded files, to enable skipping/scrubbing

 
FIX BUGS:

*   repair logging while worker.scan / worker.merge 
*   remove expired sessions
*   set subsonic token duration
