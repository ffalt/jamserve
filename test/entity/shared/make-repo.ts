export function makeRepo<T>(
	RepoClass: new (em: never, entity: never) => T,
	dialect: 'sqlite' | 'postgres' = 'sqlite'
): T {
	return new RepoClass({ dialect } as never, '' as never);
}
