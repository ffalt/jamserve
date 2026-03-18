export const mockUser = { id: 'user-1' };

/** State with activity data — used in resolver tests */
export const mockState = { played: 3, lastPlayed: undefined as undefined, faved: undefined as undefined, rated: 4 };

/** Empty/default state — used in transform tests */
export const mockStateEmpty = { played: 0, lastPlayed: undefined as undefined, faved: undefined as undefined, rated: undefined as undefined };

export const mockTracks = [{ id: 'track-1' }, { id: 'track-2' }];
export const mockGenres = [{ id: 'genre-1', name: 'Rock' }];
export const mockRoots = [{ id: 'root-1' }];
export const mockFolders = [{ id: 'folder-1' }, { id: 'folder-2' }];

export const mockTrackDTO = { id: 'track-1' };
export const mockTrackPage = { items: [] as Array<unknown>, total: 0, offset: 0, take: 20 };
export const mockInfo = { description: 'Some info' };

// Album entity mocks
export const mockAlbum = { id: 'album-1', name: 'Test Album' };
export const mockAlbumDTO = { id: 'album-1', name: 'Test Album', duration: 0 };
export const mockAlbumIndex = { lastModified: Date.now(), groups: [] as Array<never> };
export const mockAlbumPage = { items: [] as Array<unknown>, total: 0, offset: 0, take: 20 };

// Artist entity mocks
export const mockArtist = { id: 'artist-1', name: 'Test Artist' };
export const mockArtistDTO = { id: 'artist-1', name: 'Test Artist' };
export const mockArtistIndex = { lastModified: Date.now(), groups: [] as Array<never> };
export const mockArtistPage = { items: [mockArtistDTO] as Array<unknown>, total: 1, offset: 0, take: 20 };

// Series page (empty)
export const mockSeriesPage = { items: [] as Array<unknown>, total: 0, offset: 0, take: 20 };
export const mockSeries = { id: 'series-1', name: 'My Series' };

// Simple DTO reference factories (id + name only, distinct from ORM makeArtist in make-artist.ts)
export function makeArtistReference(id = 'artist-1', name = 'Test Artist') {
	return { id, name };
}
export function makeSeriesReference(id = 'series-1', name = 'Test Series') {
	return { id, name };
}
