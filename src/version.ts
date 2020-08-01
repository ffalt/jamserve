import fse from 'fs-extra';
import path from 'path';

const pack = fse.readJSONSync(path.join(__dirname, '../package.json'));
export const JAMSERVE_VERSION = pack.version;
