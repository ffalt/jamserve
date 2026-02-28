/**
 * Centralized date/time helpers.
 */

/**
 * Map of time-unit strings (including moment.js-style abbreviations) to
 * their multiplier in milliseconds.
 */
const UNIT_MS: Record<string, number> = {
	ms: 1, millisecond: 1, milliseconds: 1,
	s: 1000, second: 1000, seconds: 1000,
	m: 60_000, minute: 60_000, minutes: 60_000,
	h: 3_600_000, hour: 3_600_000, hours: 3_600_000,
	d: 86_400_000, day: 86_400_000, days: 86_400_000,
	w: 604_800_000, week: 604_800_000, weeks: 604_800_000,
	M: 2_592_000_000, month: 2_592_000_000, months: 2_592_000_000,
	y: 31_536_000_000, year: 31_536_000_000, years: 31_536_000_000
};

/**
 * Convert a numeric value with a time-unit string to milliseconds.
 *
 * Example: `durationToMilliseconds(2, 'hours')` → 7200000
 */
export function durationToMilliseconds(value: number, unit: string): number {
	const multiplier = UNIT_MS[unit] as number | undefined;
	if (multiplier === undefined) {
		return 0;
	}
	return value * multiplier;
}

/**
 * Parse a colon-separated duration string (e.g. "01:23:45" or "01:23:45.678")
 * and return the total number of **milliseconds**.
 *
 * Two-part strings (e.g. "05:30") are treated as hours:minutes (matching
 * the behaviour of the previous moment.js-based implementation).
 */
export function parseDurationToMilliseconds(s: string): number {
	const parts = s.split(':');
	if (parts.length === 2) {
		// HH:MM
		const hours = Number(parts.at(0));
		const minutes = Number(parts.at(1));
		return (hours * 3_600_000) + (minutes * 60_000);
	}
	if (parts.length >= 3) {
		// HH:MM:SS or HH:MM:SS.mmm
		const hours = Number(parts.at(0));
		const minutes = Number(parts.at(1));
		const secParts = parts.at(2)!.split('.');
		const seconds = Number(secParts.at(0));
		const ms = secParts.length > 1 ? Number(secParts.at(1)!.padEnd(3, '0').slice(0, 3)) : 0;
		return (hours * 3_600_000) + (minutes * 60_000) + (seconds * 1000) + ms;
	}
	return 0;
}

/**
 * Parse a colon-separated duration string (e.g. "01:23:45") and return
 * the total number of **seconds**.
 */
export function parseDurationToSeconds(s: string): number {
	return parseDurationToMilliseconds(s) / 1000;
}

/**
 * Return `true` when two date-like values represent the same instant.
 */
export function isSameDate(a: Date | number, b: Date | number): boolean {
	return toDateNumber(a) === toDateNumber(b);
}

/**
 * Return the date as a number
 */
export function toDateNumber(a: Date | number | string): number {
	return a instanceof Date ? a.getTime() : (typeof a === 'number' ? a : new Date(a as string).getTime());
}

/**
 * Format a duration given in milliseconds as `"HH:mm:ss.SSS"`.
 *
 * Example: `formatElapsedDuration(3661001)` → `"01:01:01.001"`
 */
export function formatElapsedDuration(ms: number): string {
	const totalSeconds = Math.floor(ms / 1000);
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;
	const millis = ms % 1000;
	return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(millis).padStart(3, '0')}`;
}

/**
 * Calculate how many whole minutes have elapsed since `time`.
 */
export function minutesAgo(time: number | Date): number {
	const timeMs = time instanceof Date ? time.getTime() : time;
	return Math.round((Date.now() - timeMs) / 60_000);
}

/**
 * Format a `Date` as an ISO-8601 UTC string (e.g. `"2025-06-15T12:00:00Z"`).
 */
export function formatDateToUTC(date: Date): string {
	return date.toISOString().replace('.000Z', '+00:00').replace(/\.\d{3}Z$/, '+00:00');
}

/**
 * Parse a date/time string and return its ms-since-epoch value, or `0` when
 * the string cannot be parsed.
 */
export function parseDateToTimestamp(value: string): number {
	const ms = new Date(value).getTime();
	return Number.isNaN(ms) ? 0 : ms;
}

/**
 * Return the epoch-ms value of "now minus `ms` milliseconds".
 */
export function nowMinusMilliseconds(ms: number): number {
	return Date.now() - ms;
}
