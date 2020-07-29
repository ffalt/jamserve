"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerORMEnums = void 0;
const enums_1 = require("../../../types/enums");
const enums_2 = require("../../orm/helpers/enums");
function registerORMEnums() {
    enums_2.registerEnumType(enums_1.DBObjectType, { name: 'DBObjectType' });
    enums_2.registerEnumType(enums_1.PodcastStatus, { name: 'PodcastStatus' });
    enums_2.registerEnumType(enums_1.MetaDataType, { name: 'MetaDataType' });
    enums_2.registerEnumType(enums_1.ArtworkImageType, { name: 'ArtworkImageType' });
    enums_2.registerEnumType(enums_1.AudioFormatType, { name: 'AudioFormatType' });
    enums_2.registerEnumType(enums_1.RootScanStrategy, { name: 'RootScanStrategy' });
    enums_2.registerEnumType(enums_1.TagFormatType, { name: 'TagFormatType' });
    enums_2.registerEnumType(enums_1.FolderType, { name: 'FolderType' });
    enums_2.registerEnumType(enums_1.AlbumType, { name: 'AlbumType' });
    enums_2.registerEnumType(enums_1.SessionMode, { name: 'SessionMode' });
}
exports.registerORMEnums = registerORMEnums;
//# sourceMappingURL=enum-registration.js.map