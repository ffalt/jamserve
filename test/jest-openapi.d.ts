declare module 'expect' {
	interface Matchers<R extends void | Promise<void>, T = unknown> {
		toSatisfyApiSpec(): R;
		toSatisfySchemaInApiSpec(schemaName: string): R;
	}
}
