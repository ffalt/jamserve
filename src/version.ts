import fse from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pack = fse.readJSONSync(path.join(__dirname, '../package.json'));
export const JAMSERVE_VERSION = pack.version;
