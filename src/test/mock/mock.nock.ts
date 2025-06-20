import nock from 'nock';

const TESTING_URL = 'https://example.com';

export function mockNockURL(route: string): string {
	return `${TESTING_URL}/${route}`;
}

export function mockNock(): nock.Scope {
	return nock(TESTING_URL).persist();
}
