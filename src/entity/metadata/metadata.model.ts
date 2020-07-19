import {ObjField, ResultType} from '../../modules/rest/decorators';

@ResultType({description: 'Track/Folder/Artist/Album Info Data'})
export class ExtendedInfo {
	@ObjField({description: 'Description', example: 'Very long Meta Information'})
	description!: string;
	@ObjField({description: 'Source of the Description', example: 'https://mediaservice.example.com'})
	source!: string;
	@ObjField({description: 'License of the Description', example: 'CC0'})
	license!: string;
	@ObjField({description: 'Url of the Description', example: 'https://mediaservice.example.com/info/id/12345'})
	url!: string;
	@ObjField({description: 'Url of the License', example: 'https://creativecommons.org/share-your-work/public-domain/cc0/'})
	licenseUrl!: string;
}

@ResultType({description: 'Extended Info Result'})
export class ExtendedInfoResult {
	@ObjField(() => ExtendedInfo, {nullable: true, description: 'Extended Info'})
	info?: ExtendedInfo;
}

@ResultType({description: 'Metadata Result'})
export class MetaDataResult {
	@ObjField(() => Object, {nullable: true, description: 'MetaData'})
	data?: any;
}
