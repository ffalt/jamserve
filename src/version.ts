import fse from 'fs-extra';
import path from 'path';
import url from 'url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pack = fse.readJSONSync(path.join(__dirname, '../package.json'));
export const JAMSERVE_VERSION = pack.version;
