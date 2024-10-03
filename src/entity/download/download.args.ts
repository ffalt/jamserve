import { DownloadFormatType } from '../../types/enums.js';
import { ObjParamsType } from '../../modules/rest/decorators/ObjParamsType.js';
import { ObjField } from '../../modules/rest/decorators/ObjField.js';

@ObjParamsType()
export class DownloadArgs {
	@ObjField(() => DownloadFormatType, { nullable: true, description: 'format of download stream', defaultValue: DownloadFormatType.zip, example: DownloadFormatType.zip })
	format?: DownloadFormatType;
}
