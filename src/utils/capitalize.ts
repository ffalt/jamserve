export function capitalize(s: string): string {
	return (s.at(0) ?? '').toUpperCase() + s.slice(1);
}
