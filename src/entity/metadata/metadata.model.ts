import { Field, ObjectType } from 'type-graphql';
import { ResultType } from '../../modules/rest/decorators/result-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';

@ObjectType()
@ResultType({ description: 'Track/Folder/Artist/Album Info Data' })
export class ExtendedInfo {
	@Field(() => String)
	@ObjectField({ description: 'Description', example: 'Very long Meta Information' })
	description!: string;

	@Field(() => String)
	@ObjectField({ description: 'Source of the Description', example: 'https://mediaservice.example.com' })
	source!: string;

	@Field(() => String)
	@ObjectField({ description: 'License of the Description', example: 'CC0' })
	license!: string;

	@Field(() => String)
	@ObjectField({ description: 'Url of the Description', example: 'https://mediaservice.example.com/info/id/12345' })
	url!: string;

	@Field(() => String)
	@ObjectField({ description: 'Url of the License', example: 'https://creativecommons.org/share-your-work/public-domain/cc0/' })
	licenseUrl!: string;
}

@ObjectType()
export class ExtendedInfoQL extends ExtendedInfo {
}

@ObjectType()
@ResultType({ description: 'Extended Info Result' })
export class ExtendedInfoResult {
	@Field(() => ExtendedInfoQL, { nullable: true })
	@ObjectField(() => ExtendedInfo, { nullable: true, description: 'Extended Info' })
	info?: ExtendedInfo;
}

@ObjectType()
export class ExtendedInfoResultQL extends ExtendedInfoResult {
}

@ResultType({ description: 'Metadata Result' })
export class MetaDataResult {
	@ObjectField(() => Object, { nullable: true, description: 'MetaData' })
	data?: any;
}
