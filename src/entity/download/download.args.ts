import {ObjField, ObjParamsType} from '../../modules/rest/decorators';
import {DownloadFormatType} from '../../types/enums';

@ObjParamsType()
export class DownloadArgs {
	@ObjField(() => DownloadFormatType, {nullable: true, description: 'format of download stream', defaultValue: DownloadFormatType.zip, example: DownloadFormatType.zip})
	format?: DownloadFormatType;
}
