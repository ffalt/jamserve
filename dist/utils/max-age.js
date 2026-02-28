import { durationToMilliseconds } from './date-time.js';
export const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;
export function getMaxAge(maxAgeSpec, defaultMs = 0) {
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
    return defaultMs;
}
//# sourceMappingURL=max-age.js.map