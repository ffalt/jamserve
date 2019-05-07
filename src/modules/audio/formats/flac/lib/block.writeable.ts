import {MetaDataBlock} from './block';

export abstract class MetaWriteableDataBlock extends MetaDataBlock {
	abstract publish(): Buffer;
}
