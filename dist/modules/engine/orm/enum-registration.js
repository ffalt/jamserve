import { AlbumType, ArtworkImageType, AudioFormatType, DBObjectType, FolderType, MetaDataType, PodcastStatus, RootScanStrategy, SessionMode, TagFormatType } from '../../../types/enums';
import { registerEnumType } from '../../orm/helpers/enums';
export function registerORMEnums() {
    registerEnumType(DBObjectType, { name: 'DBObjectType' });
    registerEnumType(PodcastStatus, { name: 'PodcastStatus' });
    registerEnumType(MetaDataType, { name: 'MetaDataType' });
    registerEnumType(ArtworkImageType, { name: 'ArtworkImageType' });
    registerEnumType(AudioFormatType, { name: 'AudioFormatType' });
    registerEnumType(RootScanStrategy, { name: 'RootScanStrategy' });
    registerEnumType(TagFormatType, { name: 'TagFormatType' });
    registerEnumType(FolderType, { name: 'FolderType' });
    registerEnumType(AlbumType, { name: 'AlbumType' });
    registerEnumType(SessionMode, { name: 'SessionMode' });
}
//# sourceMappingURL=enum-registration.js.map