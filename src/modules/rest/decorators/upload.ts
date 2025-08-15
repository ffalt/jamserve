import { metadataStorage } from '../metadata/metadata-storage.js';
import { BaseUpload, UploadOptions } from '../../deco/decorators/base-upload.js';
import { ReturnTypeFunction } from '../../deco/definitions/types.js';

export function Upload(name: string, options?: UploadOptions): ParameterDecorator;
export function Upload(name: string, returnTypeFunction: ReturnTypeFunction, options?: UploadOptions): ParameterDecorator;
export function Upload(name: string, returnTypeFunctionOrOptions?: ReturnTypeFunction | UploadOptions, maybeOptions?: UploadOptions): ParameterDecorator {
	return BaseUpload(metadataStorage(), name, returnTypeFunctionOrOptions, maybeOptions);
}
