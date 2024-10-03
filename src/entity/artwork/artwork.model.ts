import { Base, Page } from '../base/base.model.js';
import { ArtworkImageType } from '../../types/enums.js';
import { FolderBase } from '../folder/folder-base.model.js';
import {ObjField} from '../../modules/rest/decorators/ObjField.js';
import {ResultType} from '../../modules/rest/decorators/ResultType.js';

@ResultType({ description: 'Artwork' })
export class ArtworkBase extends Base {
	@ObjField(() => [ArtworkImageType], { description: 'Artwork Image Type', example: [ArtworkImageType.front] })
	types!: Array<ArtworkImageType>;

	@ObjField({ nullable: true, description: 'Image Height', min: 0, example: 500 })
	height?: number;

	@ObjField({ nullable: true, description: 'Image Width', min: 0, example: 500 })
	width?: number;

	@ObjField({ nullable: true, description: 'Image Format', example: 'png' })
	format?: string;

	@ObjField({ description: 'File Size', min: 0, example: 500 })
	size!: number;
}

@ResultType({ description: 'Artwork with Folder' })
export class Artwork extends ArtworkBase {
	@ObjField(() => FolderBase, { nullable: true, description: 'Artwork Folder' })
	folder?: FolderBase;
}

@ResultType({ description: 'Artwork Page' })
export class ArtworkPage extends Page {
	@ObjField(() => Artwork, { description: 'List of Artworks' })
	items!: Array<Artwork>;
}
