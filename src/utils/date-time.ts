/**
 * Centralized date/time helpers.
 * All moment.js usage is isolated here so it can later be replaced.
 */
import moment from 'moment';

/**
 * Convert a numeric value with a time-unit string to milliseconds.
 *
 * Example: `durationToMilliseconds(2, 'hours')` → 7200000
 */
export function durationToMilliseconds(value: number, unit: string): number {
	return moment.duration(value, unit as moment.unitOfTime.Base).asMilliseconds();
}

/**
 * Parse a colon-separated duration string (e.g. "01:23:45") and return
 * the total number of **milliseconds**.
 */
export function parseDurationToMilliseconds(s: string): number {
	return moment.duration(s).as('milliseconds');
}

/**
 * Parse a colon-separated duration string (e.g. "01:23:45") and return
 * the total number of **seconds**.
 */
export function parseDurationToSeconds(s: string): number {
	return moment.duration(s).as('seconds');
}

/**
 * Return `true` when two date-like values represent the same instant.
 */
export function isSameDate(a: Date | number, b: Date | number): boolean {
	return moment(a).isSame(b);
}

/**
 * Format a duration given in milliseconds as `"HH:mm:ss.SSS"`.
 *
 * Example: `formatElapsedDuration(3661001)` → `"01:01:01.001"`
 */
export function formatElapsedDuration(ms: number): string {
	return moment.utc(ms).format('HH:mm:ss.SSS');
}

/**
 * Calculate how many whole minutes have elapsed since `time`.
 */
export function minutesAgo(time: number | Date): number {
	return Math.round(moment.duration(moment().diff(moment(time))).asMinutes());
}

/**
 * Format a `Date` as an ISO-8601 UTC string (e.g. `"2025-06-15T12:00:00Z"`).
 */
export function formatDateToUTC(date: Date): string {
	return moment(date).utc().format();
}

/**
 * Parse a date/time string and return its ms-since-epoch value, or `0` when
 * the string cannot be parsed.
 */
export function parseDateToTimestamp(value: string): number {
	return moment(value).valueOf() || 0;
}

/**
 * Return the epoch-ms value of "now minus `ms` milliseconds".
 */
export function nowMinusMilliseconds(ms: number): number {
	return moment().subtract(ms, 'milliseconds').valueOf();
}
