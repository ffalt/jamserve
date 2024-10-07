var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Field, ID, Int, ObjectType } from 'type-graphql';
import { Min } from 'class-validator';
import { ResultType } from '../../modules/rest/decorators/ResultType.js';
import { ObjParamsType } from '../../modules/rest/decorators/ObjParamsType.js';
import { ObjField } from '../../modules/rest/decorators/ObjField.js';
const AdminSettingsChatMaxAgeDesc = {
    _: 'Admin Chat Maximum Age Settings',
    value: 'Value of Maximum Age',
    unit: 'Unit of Maximum Age'
};
let AdminSettingsChatMaxAge = class AdminSettingsChatMaxAge {
};
__decorate([
    ObjField({ description: AdminSettingsChatMaxAgeDesc.value, min: 0, example: 1 }),
    Field(() => Int, { description: AdminSettingsChatMaxAgeDesc.value }),
    Min(0),
    __metadata("design:type", Number)
], AdminSettingsChatMaxAge.prototype, "value", void 0);
__decorate([
    ObjField({ description: AdminSettingsChatMaxAgeDesc.unit, example: 'day' }),
    Field(() => String, { description: AdminSettingsChatMaxAgeDesc.unit }),
    __metadata("design:type", String)
], AdminSettingsChatMaxAge.prototype, "unit", void 0);
AdminSettingsChatMaxAge = __decorate([
    ResultType({ description: AdminSettingsChatMaxAgeDesc._ }),
    ObjectType({ description: AdminSettingsChatMaxAgeDesc._ }),
    ObjParamsType()
], AdminSettingsChatMaxAge);
export { AdminSettingsChatMaxAge };
let AdminSettingsChatMaxAgeQL = class AdminSettingsChatMaxAgeQL extends AdminSettingsChatMaxAge {
};
AdminSettingsChatMaxAgeQL = __decorate([
    ObjectType({ description: AdminSettingsChatMaxAgeDesc._ })
], AdminSettingsChatMaxAgeQL);
export { AdminSettingsChatMaxAgeQL };
const AdminSettingsChatDesc = {
    _: 'Admin Chat Settings',
    maxMessages: 'Maximum Number of Chat Messages to keep',
    maxAge: 'Maximum Age of Chat Messages to keep'
};
let AdminSettingsChat = class AdminSettingsChat {
};
__decorate([
    Field(() => Int, { description: AdminSettingsChatDesc.maxMessages }),
    ObjField({ description: AdminSettingsChatDesc.maxMessages, min: 0, example: 50 }),
    Min(0),
    __metadata("design:type", Number)
], AdminSettingsChat.prototype, "maxMessages", void 0);
__decorate([
    Field(() => AdminSettingsChatMaxAgeQL, { description: AdminSettingsChatDesc.maxAge }),
    ObjField(() => AdminSettingsChatMaxAge, { description: AdminSettingsChatDesc.maxAge }),
    __metadata("design:type", AdminSettingsChatMaxAge)
], AdminSettingsChat.prototype, "maxAge", void 0);
AdminSettingsChat = __decorate([
    ResultType({ description: AdminSettingsChatDesc._ }),
    ObjectType({ description: AdminSettingsChatDesc._ }),
    ObjParamsType()
], AdminSettingsChat);
export { AdminSettingsChat };
let AdminSettingsChatQL = class AdminSettingsChatQL extends AdminSettingsChat {
};
AdminSettingsChatQL = __decorate([
    ObjectType({ description: AdminSettingsChatDesc._ })
], AdminSettingsChatQL);
export { AdminSettingsChatQL };
const AdminSettingsIndexDesc = {
    _: 'Admin Index Settings',
    ignoreArticles: 'List of ignored Articles'
};
let AdminSettingsIndex = class AdminSettingsIndex {
};
__decorate([
    ObjField(() => [String], { description: AdminSettingsIndexDesc.ignoreArticles, example: ['the', 'les', 'die'] }),
    Field(() => [String], { description: AdminSettingsIndexDesc.ignoreArticles }),
    __metadata("design:type", Array)
], AdminSettingsIndex.prototype, "ignoreArticles", void 0);
AdminSettingsIndex = __decorate([
    ResultType({ description: AdminSettingsIndexDesc._ }),
    ObjectType({ description: AdminSettingsIndexDesc._ }),
    ObjParamsType()
], AdminSettingsIndex);
export { AdminSettingsIndex };
let AdminSettingsIndexQL = class AdminSettingsIndexQL extends AdminSettingsIndex {
};
AdminSettingsIndexQL = __decorate([
    ObjectType({ description: AdminSettingsIndexDesc._ })
], AdminSettingsIndexQL);
export { AdminSettingsIndexQL };
const AdminSettingsLibraryDesc = {
    _: 'Admin Library Settings',
    scanAtStart: 'Start Root Scanning on Server Start'
};
let AdminSettingsLibrary = class AdminSettingsLibrary {
};
__decorate([
    ObjField(() => Boolean, { description: AdminSettingsLibraryDesc.scanAtStart, example: true }),
    Field(() => Boolean, { description: AdminSettingsLibraryDesc.scanAtStart }),
    __metadata("design:type", Boolean)
], AdminSettingsLibrary.prototype, "scanAtStart", void 0);
AdminSettingsLibrary = __decorate([
    ResultType({ description: AdminSettingsLibraryDesc._ }),
    ObjectType({ description: AdminSettingsLibraryDesc._ }),
    ObjParamsType()
], AdminSettingsLibrary);
export { AdminSettingsLibrary };
let AdminSettingsLibraryQL = class AdminSettingsLibraryQL extends AdminSettingsLibrary {
};
AdminSettingsLibraryQL = __decorate([
    ObjectType({ description: AdminSettingsLibraryDesc._ })
], AdminSettingsLibraryQL);
export { AdminSettingsLibraryQL };
const AdminSettingsExternalDesc = {
    _: 'Admin External Services Settings',
    enabled: 'Enable External Services'
};
let AdminSettingsExternal = class AdminSettingsExternal {
};
__decorate([
    ObjField(() => Boolean, { description: AdminSettingsExternalDesc.enabled, example: true }),
    Field(() => Boolean, { description: AdminSettingsExternalDesc.enabled }),
    __metadata("design:type", Boolean)
], AdminSettingsExternal.prototype, "enabled", void 0);
AdminSettingsExternal = __decorate([
    ResultType({ description: AdminSettingsExternalDesc._ }),
    ObjectType({ description: AdminSettingsExternalDesc._ }),
    ObjParamsType()
], AdminSettingsExternal);
export { AdminSettingsExternal };
let AdminSettingsExternalQL = class AdminSettingsExternalQL extends AdminSettingsExternal {
};
AdminSettingsExternalQL = __decorate([
    ObjectType({ description: AdminSettingsExternalDesc._ })
], AdminSettingsExternalQL);
export { AdminSettingsExternalQL };
const AdminSettingsDesc = {
    _: 'Admin Settings'
};
let AdminSettings = class AdminSettings {
};
__decorate([
    ObjField(() => AdminSettingsChat, { description: AdminSettingsChatDesc._ }),
    Field(() => AdminSettingsChatQL),
    __metadata("design:type", AdminSettingsChat)
], AdminSettings.prototype, "chat", void 0);
__decorate([
    ObjField(() => AdminSettingsIndex, { description: AdminSettingsIndexDesc._ }),
    Field(() => AdminSettingsIndexQL),
    __metadata("design:type", AdminSettingsIndex)
], AdminSettings.prototype, "index", void 0);
__decorate([
    ObjField(() => AdminSettingsLibrary, { description: AdminSettingsLibraryDesc._ }),
    Field(() => AdminSettingsLibraryQL),
    __metadata("design:type", AdminSettingsLibrary)
], AdminSettings.prototype, "library", void 0);
__decorate([
    ObjField(() => AdminSettingsExternal, { description: AdminSettingsExternalDesc._ }),
    Field(() => AdminSettingsExternalQL),
    __metadata("design:type", AdminSettingsExternal)
], AdminSettings.prototype, "externalServices", void 0);
AdminSettings = __decorate([
    ResultType({ description: AdminSettingsDesc._ }),
    ObjectType({ description: AdminSettingsDesc._ }),
    ObjParamsType()
], AdminSettings);
export { AdminSettings };
let AdminSettingsQL = class AdminSettingsQL extends AdminSettings {
};
AdminSettingsQL = __decorate([
    ObjectType({ description: AdminSettingsDesc._ })
], AdminSettingsQL);
export { AdminSettingsQL };
const AdminChangeQueueInfoDesc = {
    _: 'Admin Change Queue Info',
    id: 'Queue ID',
    position: 'Waiting Position',
    error: 'Error (if any)',
    done: 'Changes Completed Timestamp'
};
let AdminChangeQueueInfo = class AdminChangeQueueInfo {
};
__decorate([
    ObjField({ description: AdminChangeQueueInfoDesc.id, isID: true }),
    Field(() => ID, { description: AdminChangeQueueInfoDesc.id }),
    __metadata("design:type", String)
], AdminChangeQueueInfo.prototype, "id", void 0);
__decorate([
    ObjField({ nullable: true, description: AdminChangeQueueInfoDesc.position, example: 1 }),
    Field(() => Int, { description: AdminChangeQueueInfoDesc.position }),
    __metadata("design:type", Number)
], AdminChangeQueueInfo.prototype, "position", void 0);
__decorate([
    ObjField({ nullable: true, description: AdminChangeQueueInfoDesc.error, example: 'Root Folder does not exists' }),
    Field(() => String, { description: AdminChangeQueueInfoDesc.error }),
    __metadata("design:type", String)
], AdminChangeQueueInfo.prototype, "error", void 0);
__decorate([
    ObjField({ nullable: true, description: AdminChangeQueueInfoDesc.done, example: true }),
    Field(() => Int, { description: AdminChangeQueueInfoDesc.done }),
    __metadata("design:type", Number)
], AdminChangeQueueInfo.prototype, "done", void 0);
AdminChangeQueueInfo = __decorate([
    ResultType({ description: AdminChangeQueueInfoDesc._ }),
    ObjectType({ description: AdminChangeQueueInfoDesc._ })
], AdminChangeQueueInfo);
export { AdminChangeQueueInfo };
let AdminChangeQueueInfoQL = class AdminChangeQueueInfoQL extends AdminChangeQueueInfo {
};
AdminChangeQueueInfoQL = __decorate([
    ObjectType({ description: AdminChangeQueueInfoDesc._ })
], AdminChangeQueueInfoQL);
export { AdminChangeQueueInfoQL };
//# sourceMappingURL=admin.js.map