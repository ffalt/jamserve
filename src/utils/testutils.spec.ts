import {isWindows} from './which';
import {ensureTrailingPathSeparator} from './fs-utils';

export function mockPath(name: string): string {
	return ensureTrailingPathSeparator((isWindows ? 'c:\\invalid\\test\\path\\' : '/invalid/test/path/') + name);
}
