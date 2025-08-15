import { DownloadFormatType } from '../../types/enums.js';
import { ObjectParametersType } from '../../modules/rest/decorators/object-parameters-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';

@ObjectParametersType()
export class DownloadParameters {
	@ObjectField(() => DownloadFormatType, { nullable: true, description: 'format of download stream', defaultValue: DownloadFormatType.zip, example: DownloadFormatType.zip })
	format?: DownloadFormatType;
}
