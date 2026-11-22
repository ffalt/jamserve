import fs from "node:fs";
import path from "node:path";

/*
	Sandboxes point TMPDIR at a dotted path, for example ~/.claude/tmp, and express
	refuses to send a file whose path holds a dot segment, so every test serving a
	file answers 500. CI runners provide a usable temp dir, so only local runs are
	redirected, to <root>/tmp.
*/
export default function globalSetup() {
	if (process.env.CI) {
		return;
	}
	const dir = path.resolve(import.meta.dirname, "tmp");
	fs.mkdirSync(dir, { recursive: true });
	process.env.TMPDIR = dir;
}
