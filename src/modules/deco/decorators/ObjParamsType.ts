import {MetadataStorage} from '../definitions/metadata-storage.js';

export function BaseObjParamsType(metadata: MetadataStorage): ClassDecorator {
  return target => {
    metadata.argumentTypes.push({
      name: target.name,
      target,
      fields: []
    });
  };
}
