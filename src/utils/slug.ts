export function slugify(s: string): string {
	return s.replaceAll(/[[\]. -]/g, '').toLowerCase();
}
