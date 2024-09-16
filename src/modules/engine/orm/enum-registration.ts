import {AlbumType, ArtworkImageType, AudioFormatType, DBObjectType, FolderType, MetaDataType, PodcastStatus, RootScanStrategy, SessionMode, TagFormatType} from '../../../types/enums.js';
import {registerEnumType} from '../../orm/helpers/enums.js';

export function registerORMEnums(): void {
	registerEnumType(DBObjectType, {name: 'DBObjectType'});
	registerEnumType(PodcastStatus, {name: 'PodcastStatus'});
	registerEnumType(MetaDataType, {name: 'MetaDataType'});
	registerEnumType(ArtworkImageType, {name: 'ArtworkImageType'});
	registerEnumType(AudioFormatType, {name: 'AudioFormatType'});
	registerEnumType(RootScanStrategy, {name: 'RootScanStrategy'});
	registerEnumType(TagFormatType, {name: 'TagFormatType'});
	registerEnumType(FolderType, {name: 'FolderType'});
	registerEnumType(AlbumType, {name: 'AlbumType'});
	registerEnumType(SessionMode, {name: 'SessionMode'});
}
