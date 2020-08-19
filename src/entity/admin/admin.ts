import {Field, ID, Int, ObjectType} from 'type-graphql';
import {Min} from 'class-validator';
import {ObjField, ObjParamsType, ResultType} from '../../modules/rest/decorators';


const AdminSettingsChatMaxAgeDesc = {
	_: 'Admin Chat Maximum Age Settings',
	value: 'Value of Maximum Age',
	unit: 'Unit of Maximum Age'
};

@ResultType({description: AdminSettingsChatMaxAgeDesc._})
@ObjectType({description: AdminSettingsChatMaxAgeDesc._})
@ObjParamsType()
export class AdminSettingsChatMaxAge {
	@ObjField({description: AdminSettingsChatMaxAgeDesc.value, min: 0, example: 1})
	@Field(() => Int, {description: AdminSettingsChatMaxAgeDesc.value})
	@Min(0)
	value!: number;
	@ObjField({description: AdminSettingsChatMaxAgeDesc.unit, example: 'day'})
	@Field(() => String, {description: AdminSettingsChatMaxAgeDesc.unit})
	unit!: string;
}

@ObjectType({description: AdminSettingsChatMaxAgeDesc._})
export class AdminSettingsChatMaxAgeQL extends AdminSettingsChatMaxAge {
}


const AdminSettingsChatDesc = {
	_: 'Admin Chat Settings',
	maxMessages: 'Maximum Number of Chat Messages to keep',
	maxAge: 'Maximum Age of Chat Messages to keep'
};

@ResultType({description: AdminSettingsChatDesc._})
@ObjectType({description: AdminSettingsChatDesc._})
@ObjParamsType()
export class AdminSettingsChat {
	@Field(() => Int, {description: AdminSettingsChatDesc.maxMessages})
	@ObjField({description: AdminSettingsChatDesc.maxMessages, min: 0, example: 50})
	@Min(0)
	maxMessages!: number;
	@Field(() => AdminSettingsChatMaxAgeQL, {description: AdminSettingsChatDesc.maxAge})
	@ObjField(() => AdminSettingsChatMaxAge, {description: AdminSettingsChatDesc.maxAge})
	maxAge!: AdminSettingsChatMaxAge;
}

@ObjectType({description: AdminSettingsChatDesc._})
export class AdminSettingsChatQL extends AdminSettingsChat {
}


const AdminSettingsIndexDesc = {
	_: 'Admin Index Settings',
	ignoreArticles: 'List of ignored Articles'
};

@ResultType({description: AdminSettingsIndexDesc._})
@ObjectType({description: AdminSettingsIndexDesc._})
@ObjParamsType()
export class AdminSettingsIndex {
	@ObjField(() => [String], {description: AdminSettingsIndexDesc.ignoreArticles, example: ['the', 'les', 'die']})
	@Field(() => [String], {description: AdminSettingsIndexDesc.ignoreArticles})
	ignoreArticles!: Array<string>;
}

@ObjectType({description: AdminSettingsIndexDesc._})
export class AdminSettingsIndexQL extends AdminSettingsIndex {
}


const AdminSettingsLibraryDesc = {
	_: 'Admin Library Settings',
	scanAtStart: 'Start Root Scanning on Server Start'
};

@ResultType({description: AdminSettingsLibraryDesc._})
@ObjectType({description: AdminSettingsLibraryDesc._})
@ObjParamsType()
export class AdminSettingsLibrary {
	@ObjField(() => Boolean, {description: AdminSettingsLibraryDesc.scanAtStart, example: true})
	@Field(() => Boolean, {description: AdminSettingsLibraryDesc.scanAtStart})
	scanAtStart!: boolean;
}

@ObjectType({description: AdminSettingsLibraryDesc._})
export class AdminSettingsLibraryQL extends AdminSettingsLibrary {
}


const AdminSettingsExternalDesc = {
	_: 'Admin External Services Settings',
	enabled: 'Enable External Services'
};

@ResultType({description: AdminSettingsExternalDesc._})
@ObjectType({description: AdminSettingsExternalDesc._})
@ObjParamsType()
export class AdminSettingsExternal {
	@ObjField(() => Boolean, {description: AdminSettingsExternalDesc.enabled, example: true})
	@Field(() => Boolean, {description: AdminSettingsExternalDesc.enabled})
	enabled!: boolean;
}

@ObjectType({description: AdminSettingsExternalDesc._})
export class AdminSettingsExternalQL extends AdminSettingsExternal {
}


const AdminSettingsDesc = {
	_: 'Admin Settings'
};

@ResultType({description: AdminSettingsDesc._})
@ObjectType({description: AdminSettingsDesc._})
@ObjParamsType()
export class AdminSettings {
	@ObjField(() => AdminSettingsChat, {description: AdminSettingsChatDesc._})
	@Field(() => AdminSettingsChatQL)
	chat!: AdminSettingsChat;
	@ObjField(() => AdminSettingsIndex, {description: AdminSettingsIndexDesc._})
	@Field(() => AdminSettingsIndexQL)
	index!: AdminSettingsIndex;
	@ObjField(() => AdminSettingsLibrary, {description: AdminSettingsLibraryDesc._})
	@Field(() => AdminSettingsLibraryQL)
	library!: AdminSettingsLibrary;
	@ObjField(() => AdminSettingsExternal, {description: AdminSettingsExternalDesc._})
	@Field(() => AdminSettingsExternalQL)
	externalServices!: AdminSettingsExternal;
}

@ObjectType({description: AdminSettingsDesc._})
export class AdminSettingsQL extends AdminSettings {
}


const AdminChangeQueueInfoDesc = {
	_: 'Admin Change Queue Info',
	id: 'Queue ID',
	position: 'Waiting Position',
	error: 'Error (if any)',
	done: 'Changes Completed Timestamp'
};

@ResultType({description: AdminChangeQueueInfoDesc._})
@ObjectType({description: AdminChangeQueueInfoDesc._})
export class AdminChangeQueueInfo {
	@ObjField({description: AdminChangeQueueInfoDesc.id, isID: true})
	@Field(() => ID, {description: AdminChangeQueueInfoDesc.id})
	id!: string;
	@ObjField({nullable: true, description: AdminChangeQueueInfoDesc.position, example: 1})
	@Field(() => Int, {description: AdminChangeQueueInfoDesc.position})
	position?: number;
	@ObjField({nullable: true, description: AdminChangeQueueInfoDesc.error, example: 'Root Folder does not exists'})
	@Field(() => String, {description: AdminChangeQueueInfoDesc.error})
	error?: string;
	@ObjField({nullable: true, description: AdminChangeQueueInfoDesc.done, example: true})
	@Field(() => Int, {description: AdminChangeQueueInfoDesc.done})
	done?: number;
}

@ObjectType({description: AdminChangeQueueInfoDesc._})
export class AdminChangeQueueInfoQL extends AdminChangeQueueInfo {
}
