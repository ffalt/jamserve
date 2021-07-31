export const LookupBrowseTypes = {
    area: ['collection'],
    artist: ['area', 'collection', 'recording', 'release', 'release-group', 'work'],
    collection: ['area', 'artist', 'editor', 'event', 'label', 'place', 'recording', 'release', 'release-group', 'work'],
    event: ['area', 'artist', 'collection', 'place'],
    instrument: ['collection'],
    label: ['area', 'collection', 'release'],
    place: ['area', 'collection'],
    recording: ['artist', 'collection', 'release'],
    release: ['area', 'artist', 'collection', 'label', 'track', 'track_artist', 'recording', 'release-group'],
    'release-group': ['artist', 'collection', 'release'],
    series: ['collection'],
    work: ['artist', 'collection'],
    url: ['resource']
};
export const LookupIncludes = {
    area: [],
    artist: ['recordings', 'releases', 'release-groups', 'works', 'aliases', 'artist-rels', 'url-rels', 'tags', 'ratings'],
    collection: ['user-collections'],
    event: [],
    instrument: [],
    label: ['releases'],
    place: [],
    recording: ['artists', 'releases', 'artist-credits', 'aliases', 'tags', 'ratings', 'annotation'],
    release: ['artists', 'labels', 'recordings', 'release-groups', 'discids', 'media', 'isrcs', 'artist-credits', 'aliases', 'tags', 'url-rels', 'annotation'],
    'release-group': ['artists', 'releases', 'media', 'artist-credits', 'aliases', 'tags', 'ratings', 'url-rels', 'annotation'],
    series: [],
    work: [],
    url: []
};
//# sourceMappingURL=musicbrainz-client.types.js.map