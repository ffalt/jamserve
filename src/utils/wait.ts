export async function wait(ms: number): Promise<void> {
	return new Promise<void>(res => setTimeout(res, ms));
}
