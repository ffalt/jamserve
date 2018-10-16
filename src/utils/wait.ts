export async function wait(ms: number) {
	return new Promise<void>(res => setTimeout(res, ms));
}
