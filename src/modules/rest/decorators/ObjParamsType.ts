import {getMetadataStorage} from '../metadata';

export function ObjParamsType(): ClassDecorator {
  return target => {
    getMetadataStorage().collectArgsMetadata({
      name: target.name,
      target,
      fields: []
    });
  };
}
