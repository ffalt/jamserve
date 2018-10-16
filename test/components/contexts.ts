import {Engine} from '../../src/engine/engine';
import {it} from 'mocha';
import {JamServe} from '../../src/model/jamserve';

interface EngineThis extends Mocha.Context {
	engine: Engine;
}

type EngineFunc = (this: EngineThis, done: Mocha.Done) => void;

interface EngineTestFunction extends Mocha.TestFunction {
	(fn: EngineFunc): Mocha.Test;

	(title: string, fn: EngineFunc): Mocha.Test;
}

export const ite: EngineTestFunction = <EngineTestFunction>it;


interface EngineUserThis extends Mocha.Context {
	engine: Engine;
	user: JamServe.User;
}

type EngineUserFunc = (this: EngineUserThis, done: Mocha.Done) => void;

interface EngineUserTestFunction extends Mocha.TestFunction {
	(fn: EngineUserFunc): Mocha.Test;

	(title: string, fn: EngineUserFunc): Mocha.Test;
}

export const iti: EngineUserTestFunction = <EngineUserTestFunction>it;
