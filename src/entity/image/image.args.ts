import {ObjField, ObjParamsType} from '../../modules/rest/index.js';
import {ImageFormatType} from '../../types/enums.js';

@ObjParamsType()
export class ImageSizeArgs {
	@ObjField({nullable: true, description: 'size of the image', example: 300, min: 16, max: 1024})
	size?: number;
}

@ObjParamsType()
export class ImageArgs extends ImageSizeArgs {
	@ObjField({description: 'Object Id', isID: true})
	id!: string;
	@ObjField(() => ImageFormatType, {nullable: true, description: 'format of the image', example: ImageFormatType.png})
	format?: ImageFormatType;
}

@ObjParamsType()
export class ImageFormatArgs {
	@ObjField(() => ImageFormatType, {nullable: true, description: 'format of the image', example: ImageFormatType.png})
	format?: ImageFormatType;
}
