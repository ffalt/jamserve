"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminChangeQueueInfoQL = exports.AdminChangeQueueInfo = exports.AdminSettingsQL = exports.AdminSettings = exports.AdminSettingsExternalQL = exports.AdminSettingsExternal = exports.AdminSettingsLibraryQL = exports.AdminSettingsLibrary = exports.AdminSettingsIndexQL = exports.AdminSettingsIndex = exports.AdminSettingsChatQL = exports.AdminSettingsChat = exports.AdminSettingsChatMaxAgeQL = exports.AdminSettingsChatMaxAge = void 0;
const type_graphql_1 = require("type-graphql");
const class_validator_1 = require("class-validator");
const decorators_1 = require("../../modules/rest/decorators");
const AdminSettingsChatMaxAgeDesc = {
    _: 'Admin Chat Maximum Age Settings',
    value: 'Value of Maximum Age',
    unit: 'Unit of Maximum Age'
};
let AdminSettingsChatMaxAge = class AdminSettingsChatMaxAge {
};
__decorate([
    decorators_1.ObjField({ description: AdminSettingsChatMaxAgeDesc.value, min: 0, example: 1 }),
    type_graphql_1.Field(() => type_graphql_1.Int, { description: AdminSettingsChatMaxAgeDesc.value }),
    class_validator_1.Min(0),
    __metadata("design:type", Number)
], AdminSettingsChatMaxAge.prototype, "value", void 0);
__decorate([
    decorators_1.ObjField({ description: AdminSettingsChatMaxAgeDesc.unit, example: 'day' }),
    type_graphql_1.Field(() => String, { description: AdminSettingsChatMaxAgeDesc.unit }),
    __metadata("design:type", String)
], AdminSettingsChatMaxAge.prototype, "unit", void 0);
AdminSettingsChatMaxAge = __decorate([
    decorators_1.ResultType({ description: AdminSettingsChatMaxAgeDesc._ }),
    type_graphql_1.ObjectType({ description: AdminSettingsChatMaxAgeDesc._ }),
    decorators_1.ObjParamsType()
], AdminSettingsChatMaxAge);
exports.AdminSettingsChatMaxAge = AdminSettingsChatMaxAge;
let AdminSettingsChatMaxAgeQL = class AdminSettingsChatMaxAgeQL extends AdminSettingsChatMaxAge {
};
AdminSettingsChatMaxAgeQL = __decorate([
    type_graphql_1.ObjectType({ description: AdminSettingsChatMaxAgeDesc._ })
], AdminSettingsChatMaxAgeQL);
exports.AdminSettingsChatMaxAgeQL = AdminSettingsChatMaxAgeQL;
const AdminSettingsChatDesc = {
    _: 'Admin Chat Settings',
    maxMessages: 'Maximum Number of Chat Messages to keep',
    maxAge: 'Maximum Age of Chat Messages to keep'
};
let AdminSettingsChat = class AdminSettingsChat {
};
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int, { description: AdminSettingsChatDesc.maxMessages }),
    decorators_1.ObjField({ description: AdminSettingsChatDesc.maxMessages, min: 0, example: 50 }),
    class_validator_1.Min(0),
    __metadata("design:type", Number)
], AdminSettingsChat.prototype, "maxMessages", void 0);
__decorate([
    type_graphql_1.Field(() => AdminSettingsChatMaxAgeQL, { description: AdminSettingsChatDesc.maxAge }),
    decorators_1.ObjField(() => AdminSettingsChatMaxAge, { description: AdminSettingsChatDesc.maxAge }),
    __metadata("design:type", AdminSettingsChatMaxAge)
], AdminSettingsChat.prototype, "maxAge", void 0);
AdminSettingsChat = __decorate([
    decorators_1.ResultType({ description: AdminSettingsChatDesc._ }),
    type_graphql_1.ObjectType({ description: AdminSettingsChatDesc._ }),
    decorators_1.ObjParamsType()
], AdminSettingsChat);
exports.AdminSettingsChat = AdminSettingsChat;
let AdminSettingsChatQL = class AdminSettingsChatQL extends AdminSettingsChat {
};
AdminSettingsChatQL = __decorate([
    type_graphql_1.ObjectType({ description: AdminSettingsChatDesc._ })
], AdminSettingsChatQL);
exports.AdminSettingsChatQL = AdminSettingsChatQL;
const AdminSettingsIndexDesc = {
    _: 'Admin Index Settings',
    ignoreArticles: 'List of ignored Articles'
};
let AdminSettingsIndex = class AdminSettingsIndex {
};
__decorate([
    decorators_1.ObjField(() => [String], { description: AdminSettingsIndexDesc.ignoreArticles, example: ['the', 'les', 'die'] }),
    type_graphql_1.Field(() => [String], { description: AdminSettingsIndexDesc.ignoreArticles }),
    __metadata("design:type", Array)
], AdminSettingsIndex.prototype, "ignoreArticles", void 0);
AdminSettingsIndex = __decorate([
    decorators_1.ResultType({ description: AdminSettingsIndexDesc._ }),
    type_graphql_1.ObjectType({ description: AdminSettingsIndexDesc._ }),
    decorators_1.ObjParamsType()
], AdminSettingsIndex);
exports.AdminSettingsIndex = AdminSettingsIndex;
let AdminSettingsIndexQL = class AdminSettingsIndexQL extends AdminSettingsIndex {
};
AdminSettingsIndexQL = __decorate([
    type_graphql_1.ObjectType({ description: AdminSettingsIndexDesc._ })
], AdminSettingsIndexQL);
exports.AdminSettingsIndexQL = AdminSettingsIndexQL;
const AdminSettingsLibraryDesc = {
    _: 'Admin Library Settings',
    scanAtStart: 'Start Root Scanning on Server Start'
};
let AdminSettingsLibrary = class AdminSettingsLibrary {
};
__decorate([
    decorators_1.ObjField(() => Boolean, { description: AdminSettingsLibraryDesc.scanAtStart, example: true }),
    type_graphql_1.Field(() => Boolean, { description: AdminSettingsLibraryDesc.scanAtStart }),
    __metadata("design:type", Boolean)
], AdminSettingsLibrary.prototype, "scanAtStart", void 0);
AdminSettingsLibrary = __decorate([
    decorators_1.ResultType({ description: AdminSettingsLibraryDesc._ }),
    type_graphql_1.ObjectType({ description: AdminSettingsLibraryDesc._ }),
    decorators_1.ObjParamsType()
], AdminSettingsLibrary);
exports.AdminSettingsLibrary = AdminSettingsLibrary;
let AdminSettingsLibraryQL = class AdminSettingsLibraryQL extends AdminSettingsLibrary {
};
AdminSettingsLibraryQL = __decorate([
    type_graphql_1.ObjectType({ description: AdminSettingsLibraryDesc._ })
], AdminSettingsLibraryQL);
exports.AdminSettingsLibraryQL = AdminSettingsLibraryQL;
const AdminSettingsExternalDesc = {
    _: 'Admin External Services Settings',
    enabled: 'Enable External Services'
};
let AdminSettingsExternal = class AdminSettingsExternal {
};
__decorate([
    decorators_1.ObjField(() => Boolean, { description: AdminSettingsExternalDesc.enabled, example: true }),
    type_graphql_1.Field(() => Boolean, { description: AdminSettingsExternalDesc.enabled }),
    __metadata("design:type", Boolean)
], AdminSettingsExternal.prototype, "enabled", void 0);
AdminSettingsExternal = __decorate([
    decorators_1.ResultType({ description: AdminSettingsExternalDesc._ }),
    type_graphql_1.ObjectType({ description: AdminSettingsExternalDesc._ }),
    decorators_1.ObjParamsType()
], AdminSettingsExternal);
exports.AdminSettingsExternal = AdminSettingsExternal;
let AdminSettingsExternalQL = class AdminSettingsExternalQL extends AdminSettingsExternal {
};
AdminSettingsExternalQL = __decorate([
    type_graphql_1.ObjectType({ description: AdminSettingsExternalDesc._ })
], AdminSettingsExternalQL);
exports.AdminSettingsExternalQL = AdminSettingsExternalQL;
const AdminSettingsDesc = {
    _: 'Admin Settings'
};
let AdminSettings = class AdminSettings {
};
__decorate([
    decorators_1.ObjField(() => AdminSettingsChat, { description: AdminSettingsChatDesc._ }),
    type_graphql_1.Field(() => AdminSettingsChatQL),
    __metadata("design:type", AdminSettingsChat)
], AdminSettings.prototype, "chat", void 0);
__decorate([
    decorators_1.ObjField(() => AdminSettingsIndex, { description: AdminSettingsIndexDesc._ }),
    type_graphql_1.Field(() => AdminSettingsIndexQL),
    __metadata("design:type", AdminSettingsIndex)
], AdminSettings.prototype, "index", void 0);
__decorate([
    decorators_1.ObjField(() => AdminSettingsLibrary, { description: AdminSettingsLibraryDesc._ }),
    type_graphql_1.Field(() => AdminSettingsLibraryQL),
    __metadata("design:type", AdminSettingsLibrary)
], AdminSettings.prototype, "library", void 0);
__decorate([
    decorators_1.ObjField(() => AdminSettingsExternal, { description: AdminSettingsExternalDesc._ }),
    type_graphql_1.Field(() => AdminSettingsExternalQL),
    __metadata("design:type", AdminSettingsExternal)
], AdminSettings.prototype, "externalServices", void 0);
AdminSettings = __decorate([
    decorators_1.ResultType({ description: AdminSettingsDesc._ }),
    type_graphql_1.ObjectType({ description: AdminSettingsDesc._ }),
    decorators_1.ObjParamsType()
], AdminSettings);
exports.AdminSettings = AdminSettings;
let AdminSettingsQL = class AdminSettingsQL extends AdminSettings {
};
AdminSettingsQL = __decorate([
    type_graphql_1.ObjectType({ description: AdminSettingsDesc._ })
], AdminSettingsQL);
exports.AdminSettingsQL = AdminSettingsQL;
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
    decorators_1.ObjField({ description: AdminChangeQueueInfoDesc.id, isID: true }),
    type_graphql_1.Field(() => type_graphql_1.ID, { description: AdminChangeQueueInfoDesc.id }),
    __metadata("design:type", String)
], AdminChangeQueueInfo.prototype, "id", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: AdminChangeQueueInfoDesc.position, example: 1 }),
    type_graphql_1.Field(() => type_graphql_1.Int, { description: AdminChangeQueueInfoDesc.position }),
    __metadata("design:type", Number)
], AdminChangeQueueInfo.prototype, "position", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: AdminChangeQueueInfoDesc.error, example: 'Root Folder does not exists' }),
    type_graphql_1.Field(() => String, { description: AdminChangeQueueInfoDesc.error }),
    __metadata("design:type", String)
], AdminChangeQueueInfo.prototype, "error", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: AdminChangeQueueInfoDesc.done, example: true }),
    type_graphql_1.Field(() => type_graphql_1.Int, { description: AdminChangeQueueInfoDesc.done }),
    __metadata("design:type", Number)
], AdminChangeQueueInfo.prototype, "done", void 0);
AdminChangeQueueInfo = __decorate([
    decorators_1.ResultType({ description: AdminChangeQueueInfoDesc._ }),
    type_graphql_1.ObjectType({ description: AdminChangeQueueInfoDesc._ })
], AdminChangeQueueInfo);
exports.AdminChangeQueueInfo = AdminChangeQueueInfo;
let AdminChangeQueueInfoQL = class AdminChangeQueueInfoQL extends AdminChangeQueueInfo {
};
AdminChangeQueueInfoQL = __decorate([
    type_graphql_1.ObjectType({ description: AdminChangeQueueInfoDesc._ })
], AdminChangeQueueInfoQL);
exports.AdminChangeQueueInfoQL = AdminChangeQueueInfoQL;
//# sourceMappingURL=admin.js.map