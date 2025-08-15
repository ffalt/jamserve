import { Base, Page } from '../base/base.model.js';
import { ArtworkImageType } from '../../types/enums.js';
import { FolderBase } from '../folder/folder-base.model.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';
import { ResultType } from '../../modules/rest/decorators/result-type.js';

@ResultType({ description: 'Artwork' })
export class ArtworkBase extends Base {
	@ObjectField(() => [ArtworkImageType], { description: 'Artwork Image Type', example: [ArtworkImageType.front] })
	types!: Array<ArtworkImageType>;

	@ObjectField({ nullable: true, description: 'Image Height', min: 0, example: 500 })
	height?: number;

	@ObjectField({ nullable: true, description: 'Image Width', min: 0, example: 500 })
	width?: number;

	@ObjectField({ nullable: true, description: 'Image Format', example: 'png' })
	format?: string;

	@ObjectField({ description: 'File Size', min: 0, example: 500 })
	size!: number;
}

@ResultType({ description: 'Artwork with Folder' })
export class Artwork extends ArtworkBase {
	@ObjectField(() => FolderBase, { nullable: true, description: 'Artwork Folder' })
	folder?: FolderBase;
}

@ResultType({ description: 'Artwork Page' })
export class ArtworkPage extends Page {
	@ObjectField(() => Artwork, { description: 'List of Artworks' })
	items!: Array<Artwork>;
}
