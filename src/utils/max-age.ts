import { durationToMilliseconds } from './date-time.js';

/** One year expressed in milliseconds, used as the JWT default max-age. */
export const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

/**
 * Parse an env-var max-age spec of the form `"<value> <unit>"` (e.g. `"30 days"`)
 * into milliseconds.
 *
 * Returns `defaultMs` when `maxAgeSpec` is absent, empty, or unparseable.
 * `defaultMs` defaults to `0` (no expiry) so callers that do not supply it
 * retain the previous behaviour.
 */
export function getMaxAge(maxAgeSpec?: string, defaultMs = 0): number {
	if (!maxAgeSpec) {
		return defaultMs;
	}
	const split = maxAgeSpec.split(' ');
	const value = Number(split.at(0));
	const unit = split.at(1);
	if (value > 0 && unit) {
		const ms = durationToMilliseconds(value, unit);
		if (ms > 0) {
			return ms;
		}
	}
	// Spec was present but unparseable — fall back to the default.
	return defaultMs;
}
