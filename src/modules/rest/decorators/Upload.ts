import {getMetadataStorage} from '../metadata/getMetadataStorage.js';
import {BaseUpload, UploadOptions} from '../../deco/decorators/Upload.js';
import {ReturnTypeFunc} from '../../deco/definitions/types.js';

export function Upload(name: string, options?: UploadOptions): ParameterDecorator;
export function Upload(name: string, returnTypeFunc: ReturnTypeFunc, options?: UploadOptions): ParameterDecorator;
export function Upload(name: string, returnTypeFuncOrOptions?: ReturnTypeFunc | UploadOptions, maybeOptions?: UploadOptions): ParameterDecorator {
	return BaseUpload(getMetadataStorage(), name, returnTypeFuncOrOptions, maybeOptions);
}
