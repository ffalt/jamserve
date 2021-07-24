import nock from 'nock';

const INVALID_URL = 'http://invaliddomain.invaliddomain.invaliddomain';

export function mockNockURL(route: string): string {
	return `${INVALID_URL}/${route}`;
}

export function mockNock(): nock.Scope {
	return nock(INVALID_URL);
}
