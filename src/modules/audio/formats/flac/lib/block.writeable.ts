import { MetadataBlock } from './block.js';

export abstract class MetaWriteableDataBlock extends MetadataBlock {
	abstract publish(): Buffer;
}
