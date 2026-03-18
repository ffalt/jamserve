import { Op } from 'sequelize';

/** Flatten the where clause – handles both single-condition and Op.and-wrapped forms. */
export function flattenWhere(where: unknown): Array<Record<string, unknown>> {
	if (!where) {
		return [];
	}
	const w = where as Record<symbol | string, unknown>;
	const andList = w[Op.and] as Array<Record<string, unknown>> | undefined;
	if (andList) {
		return andList;
	}
	return [w as Record<string, unknown>];
}
