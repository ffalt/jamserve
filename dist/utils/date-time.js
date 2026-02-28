const UNIT_MS = {
    ms: 1, millisecond: 1, milliseconds: 1,
    s: 1000, second: 1000, seconds: 1000,
    m: 60000, minute: 60000, minutes: 60000,
    h: 3600000, hour: 3600000, hours: 3600000,
    d: 86400000, day: 86400000, days: 86400000,
    w: 604800000, week: 604800000, weeks: 604800000,
    M: 2592000000, month: 2592000000, months: 2592000000,
    y: 31536000000, year: 31536000000, years: 31536000000
};
export function durationToMilliseconds(value, unit) {
    const multiplier = UNIT_MS[unit];
    if (multiplier === undefined) {
        return 0;
    }
    return value * multiplier;
}
export function parseDurationToMilliseconds(s) {
    const parts = s.split(':');
    if (parts.length === 2) {
        const hours = Number(parts.at(0));
        const minutes = Number(parts.at(1));
        return (hours * 3600000) + (minutes * 60000);
    }
    if (parts.length >= 3) {
        const hours = Number(parts.at(0));
        const minutes = Number(parts.at(1));
        const secParts = parts.at(2).split('.');
        const seconds = Number(secParts.at(0));
        const ms = secParts.length > 1 ? Number(secParts.at(1).padEnd(3, '0').slice(0, 3)) : 0;
        return (hours * 3600000) + (minutes * 60000) + (seconds * 1000) + ms;
    }
    return 0;
}
export function parseDurationToSeconds(s) {
    return parseDurationToMilliseconds(s) / 1000;
}
export function isSameDate(a, b) {
    return toDateNumber(a) === toDateNumber(b);
}
export function toDateNumber(a) {
    return a instanceof Date ? a.getTime() : (typeof a === 'number' ? a : new Date(a).getTime());
}
export function formatElapsedDuration(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const millis = ms % 1000;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(millis).padStart(3, '0')}`;
}
export function minutesAgo(time) {
    const timeMs = time instanceof Date ? time.getTime() : time;
    return Math.round((Date.now() - timeMs) / 60000);
}
export function formatDateToUTC(date) {
    return date.toISOString().replace('.000Z', '+00:00').replace(/\.\d{3}Z$/, '+00:00');
}
export function parseDateToTimestamp(value) {
    const ms = new Date(value).getTime();
    return Number.isNaN(ms) ? 0 : ms;
}
export function nowMinusMilliseconds(ms) {
    return Date.now() - ms;
}
//# sourceMappingURL=date-time.js.map