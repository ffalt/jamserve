import { ImageFormatType } from '../../types/enums.js';
import { ObjectParametersType } from '../../modules/rest/decorators/object-parameters-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';

@ObjectParametersType()
export class ImageSizeParameters {
	@ObjectField({ nullable: true, description: 'size of the image', example: 300, min: 16, max: 1024 })
	size?: number;
}

@ObjectParametersType()
export class ImageParameters extends ImageSizeParameters {
	@ObjectField({ description: 'Object Id', isID: true })
	id!: string;

	@ObjectField(() => ImageFormatType, { nullable: true, description: 'format of the image', example: ImageFormatType.png })
	format?: ImageFormatType;
}

@ObjectParametersType()
export class ImageFormatParameters {
	@ObjectField(() => ImageFormatType, { nullable: true, description: 'format of the image', example: ImageFormatType.png })
	format?: ImageFormatType;
}
