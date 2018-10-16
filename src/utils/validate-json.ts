const Ajv = require('ajv');
const ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}

export async function validate(data: any, schema: any): Promise<{ errors: Array<Error> }> {
	const validator = ajv.compile(schema);
	const valid = validator(data);
	if (valid) {
		return {errors: []};
	} else {
		return {errors: validator.errors};
	}
}
