import moment from 'moment';

export function getMaxAge(maxAgeSpec: { value: number; unit: string }): number {
	let maxAge = 0;
	if (maxAgeSpec.value > 0) {
		maxAge = moment.duration(maxAgeSpec.value, maxAgeSpec.unit as moment.unitOfTime.Base).asMilliseconds();
	}
	return maxAge;
}
