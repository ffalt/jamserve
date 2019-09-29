export function run(build: () => Promise<string>): void {
	build()
		.then(destfile => {
			console.log('👍', destfile, 'written');
		})
		.catch(e => {
			console.error(e);
		});
}
