import {ensureTrailingPathSeparator} from './fs-utils';
import {isWindows} from './which';

export function mockPath(name: string): string {
	return ensureTrailingPathSeparator((isWindows ? 'c:\\invalid\\test\\path\\' : '/invalid/test/path/') + name);
}
