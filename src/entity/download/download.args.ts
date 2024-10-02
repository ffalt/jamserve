import { ObjField, ObjParamsType } from '../../modules/rest/index.js';
import { DownloadFormatType } from '../../types/enums.js';

@ObjParamsType()
export class DownloadArgs {
	@ObjField(() => DownloadFormatType, { nullable: true, description: 'format of download stream', defaultValue: DownloadFormatType.zip, example: DownloadFormatType.zip })
	format?: DownloadFormatType;
}
