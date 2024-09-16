import {getMetadataStorage} from '../metadata/getMetadataStorage.js';

export function ObjParamsType(): ClassDecorator {
  return target => {
    getMetadataStorage().collectArgsMetadata({
      name: target.name,
      target,
      fields: []
    });
  };
}
