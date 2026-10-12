import { describe, expect, test } from '@jest/globals';
import { MetaStatBuilder } from '../../src/utils/stats-builder.js';

function buildIDs(values: Array<string>): MetaStatBuilder {
	const builder = new MetaStatBuilder();
	for (const value of values) {
		builder.statID('id', value);
	}
	return builder;
}

describe('MetaStatBuilder.mostUsedOrNone', () => {
	test('returns nothing if no value has been collected', () => {
		expect(buildIDs([]).mostUsedOrNone('id')).toBeUndefined();
	});

	test('returns the value if all agree', () => {
		expect(buildIDs(['a', 'a', 'a']).mostUsedOrNone('id')).toBe('a');
	});

	test('returns the value with a clear majority', () => {
		expect(buildIDs(['a', 'a', 'a', 'a', 'a', 'a', 'b']).mostUsedOrNone('id')).toBe('a');
	});

	test('returns nothing if every value is used once', () => {
		expect(buildIDs(['a', 'b', 'c', 'd']).mostUsedOrNone('id')).toBeUndefined();
	});

	test('returns nothing if several values are used repeatedly', () => {
		expect(buildIDs(['a', 'a', 'b', 'b']).mostUsedOrNone('id')).toBeUndefined();
	});

	test('returns nothing, never an empty string', () => {
		expect(buildIDs(['a', 'b', 'c', 'd']).mostUsedOrNone('id')).not.toBe('');
	});
});
