import {MetaDataBlock} from './block.js';

export abstract class MetaWriteableDataBlock extends MetaDataBlock {
	abstract publish(): Buffer;
}
