import { describe, expect, test, jest, beforeEach, afterEach } from '@jest/globals';
import {
	durationToMilliseconds,
	parseDurationToMilliseconds,
	parseDurationToSeconds,
	isSameDate,
	formatElapsedDuration,
	minutesAgo,
	formatDateToUTC,
	parseDateToTimestamp,
	nowMinusMilliseconds
} from '../../src/utils/date-time.js';

describe('date-time utilities', () => {
	describe('durationToMilliseconds', () => {
		test('should convert seconds to milliseconds', () => {
			expect(durationToMilliseconds(1, 's')).toBe(1000);
			expect(durationToMilliseconds(30, 'seconds')).toBe(30_000);
		});

		test('should convert minutes to milliseconds', () => {
			expect(durationToMilliseconds(1, 'm')).toBe(60_000);
			expect(durationToMilliseconds(5, 'minutes')).toBe(300_000);
		});

		test('should convert hours to milliseconds', () => {
			expect(durationToMilliseconds(1, 'h')).toBe(3_600_000);
			expect(durationToMilliseconds(2, 'hours')).toBe(7_200_000);
		});

		test('should convert days to milliseconds', () => {
			expect(durationToMilliseconds(1, 'd')).toBe(86_400_000);
			expect(durationToMilliseconds(7, 'days')).toBe(604_800_000);
		});

		test('should return 0 for a value of 0', () => {
			expect(durationToMilliseconds(0, 's')).toBe(0);
		});
	});

	describe('parseDurationToMilliseconds', () => {
		test('should parse HH:MM:SS format', () => {
			expect(parseDurationToMilliseconds('01:00:00')).toBe(3_600_000);
			expect(parseDurationToMilliseconds('00:01:00')).toBe(60_000);
			expect(parseDurationToMilliseconds('00:00:01')).toBe(1000);
		});

		test('should parse HH:MM:SS.mmm format', () => {
			expect(parseDurationToMilliseconds('01:02:03.456')).toBe(
				(3600 + 2 * 60 + 3) * 1000 + 456
			);
		});

		test('should parse HH:MM format (moment treats two-part as hours:minutes)', () => {
			// moment.duration('05:30') interprets this as 5 hours 30 minutes
			expect(parseDurationToMilliseconds('05:30')).toBe(19_800_000);
		});
	});

	describe('parseDurationToSeconds', () => {
		test('should parse HH:MM:SS format', () => {
			expect(parseDurationToSeconds('01:00:00')).toBe(3600);
			expect(parseDurationToSeconds('00:01:00')).toBe(60);
			expect(parseDurationToSeconds('00:00:30')).toBe(30);
		});

		test('should parse HH:MM format (moment treats two-part as hours:minutes)', () => {
			// moment.duration('05:30') interprets this as 5 hours 30 minutes
			expect(parseDurationToSeconds('05:30')).toBe(19_800);
		});

		test('should parse HH:MM:SS with leading zeros', () => {
			expect(parseDurationToSeconds('00:05:30')).toBe(330);
		});
	});

	describe('isSameDate', () => {
		test('should return true for identical Date objects', () => {
			const d = new Date('2025-06-15T12:00:00Z');
			expect(isSameDate(d, new Date(d))).toBe(true);
		});

		test('should return false for different dates', () => {
			const a = new Date('2025-06-15T12:00:00Z');
			const b = new Date('2025-06-15T12:00:01Z');
			expect(isSameDate(a, b)).toBe(false);
		});

		test('should compare Date and number (ms since epoch)', () => {
			const d = new Date('2025-06-15T12:00:00Z');
			expect(isSameDate(d, d.getTime())).toBe(true);
		});

		test('should compare two numbers', () => {
			const ts = Date.now();
			expect(isSameDate(ts, ts)).toBe(true);
			expect(isSameDate(ts, ts + 1)).toBe(false);
		});
	});

	describe('formatElapsedDuration', () => {
		test('should format 0 ms', () => {
			expect(formatElapsedDuration(0)).toBe('00:00:00.000');
		});

		test('should format milliseconds only', () => {
			expect(formatElapsedDuration(123)).toBe('00:00:00.123');
		});

		test('should format seconds and milliseconds', () => {
			expect(formatElapsedDuration(5456)).toBe('00:00:05.456');
		});

		test('should format minutes, seconds, milliseconds', () => {
			expect(formatElapsedDuration(90_000)).toBe('00:01:30.000');
		});

		test('should format hours, minutes, seconds, milliseconds', () => {
			// 1h 1m 1s 1ms = 3661001
			expect(formatElapsedDuration(3_661_001)).toBe('01:01:01.001');
		});
	});

	describe('minutesAgo', () => {
		let dateSpy: jest.Spied<typeof Date.now>;

		beforeEach(() => {
			dateSpy = jest.spyOn(Date, 'now');
		});

		afterEach(() => {
			dateSpy.mockRestore();
		});

		test('should return 0 for a timestamp equal to now', () => {
			const now = 1_700_000_000_000;
			dateSpy.mockReturnValue(now);
			expect(minutesAgo(now)).toBe(0);
		});

		test('should return 5 for a timestamp 5 minutes in the past', () => {
			const now = 1_700_000_000_000;
			dateSpy.mockReturnValue(now);
			expect(minutesAgo(now - 5 * 60_000)).toBe(5);
		});

		test('should accept a Date object', () => {
			const now = 1_700_000_000_000;
			dateSpy.mockReturnValue(now);
			expect(minutesAgo(new Date(now - 10 * 60_000))).toBe(10);
		});
	});

	describe('formatDateToUTC', () => {
		test('should format a Date as an ISO-8601 UTC string', () => {
			const d = new Date('2025-06-15T12:30:45.000Z');
			const result = formatDateToUTC(d);
			// moment().utc().format() produces something like "2025-06-15T12:30:45+00:00"
			expect(result).toMatch(/^2025-06-15T12:30:45/);
		});

		test('should always express the time in UTC', () => {
			const d = new Date('2025-01-01T00:00:00Z');
			const result = formatDateToUTC(d);
			expect(result).toContain('2025-01-01T00:00:00');
		});
	});

	describe('parseDateToTimestamp', () => {
		test('should parse an ISO date string', () => {
			const ts = parseDateToTimestamp('2025-06-15T12:00:00Z');
			expect(ts).toBe(new Date('2025-06-15T12:00:00Z').getTime());
		});

		test('should return 0 for an invalid date string', () => {
			expect(parseDateToTimestamp('not-a-date')).toBe(0);
		});

		test('should parse a date-only string', () => {
			const ts = parseDateToTimestamp('2025-06-15');
			expect(ts).toBeGreaterThan(0);
		});
	});

	describe('nowMinusMilliseconds', () => {
		let dateSpy: jest.Spied<typeof Date.now>;

		beforeEach(() => {
			dateSpy = jest.spyOn(Date, 'now');
		});

		afterEach(() => {
			dateSpy.mockRestore();
		});

		test('should subtract the given ms from the current time', () => {
			const now = 1_700_000_000_000;
			dateSpy.mockReturnValue(now);
			const result = nowMinusMilliseconds(60_000);
			// Allow a tiny tolerance because moment internally calls Date.now()
			expect(result).toBeCloseTo(now - 60_000, -1);
		});

		test('should return approximately now when ms is 0', () => {
			const now = 1_700_000_000_000;
			dateSpy.mockReturnValue(now);
			const result = nowMinusMilliseconds(0);
			expect(result).toBeCloseTo(now, -1);
		});
	});
});
