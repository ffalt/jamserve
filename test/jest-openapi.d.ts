declare module 'expect' {
	interface Matchers<R extends void | Promise<void>> {
		toSatisfyApiSpec(): R;
		toSatisfySchemaInApiSpec(schemaName: string): R;
	}
}
