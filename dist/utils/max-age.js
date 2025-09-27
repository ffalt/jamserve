import moment from 'moment';
export function getMaxAge(maxAgeSpec) {
    if (!maxAgeSpec) {
        return 0;
    }
    const split = maxAgeSpec.split(' ');
    const value = Number(split.at(0));
    const unit = split.at(1);
    let maxAge = 0;
    if (value > 0) {
        maxAge = moment.duration(value, unit).asMilliseconds();
    }
    return maxAge;
}
//# sourceMappingURL=max-age.js.map