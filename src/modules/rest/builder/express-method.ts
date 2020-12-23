import {MethodMetadata} from '../definitions/method-metadata';
import {RestContext} from '../helpers/context';
import {GenericError} from './express-error';
import {validateArgument} from './express-parameters';
import {ApiBaseResponder} from './express-responder';
import {getMetadataStorage} from '../metadata';
import {logger} from '../../../utils/logger';

const log = logger('RestAPI');

export async function callMethod(method: MethodMetadata, context: RestContext<any, any, any>, name: string): Promise<void> {
	try {
		const Controller = method.controllerClassMetadata?.target as any;
		if (!Controller) {
			throw GenericError(`Internal: Invalid controller in method ${method.methodName}`);
		}
		const instance = new Controller();// Container.get(Controller) as any;
		const func = instance[method.methodName];
		const args = [];
		const params = method.params.sort((a, b) => a.index - b.index);
		for (const param of params) {
			const arg = validateArgument(param, context);
			if (arg) {
				args.push(arg);
			}
		}
		if (method.binary !== undefined) {
			// eslint-disable-next-line prefer-spread
			const result = await func.apply(instance, args);
			ApiBaseResponder.sendBinary(context.req, context.res, result);
			return;
		}
		if (method.getReturnType === undefined) {
			// eslint-disable-next-line prefer-spread
			await func.apply(instance, args);
			ApiBaseResponder.sendOK(context.req, context.res);
			return;
		}
		const target = method.getReturnType();
		if (target === String) {
			// eslint-disable-next-line prefer-spread
			const result = await func.apply(instance, args);
			ApiBaseResponder.sendString(context.req, context.res, result);
			return;
		}
		const resultType = getMetadataStorage().resultType(target);
		if (!resultType) {
			throw GenericError(
				`The value used as a result type of '@${name}' for '${String(method.getReturnType())}' of '${method.target.name}.${method.methodName}' ` +
				`is not a class decorated with '@ResultType' decorator!`,
			);
		}
		// eslint-disable-next-line prefer-spread
		const result = await instance[method.methodName].apply(instance, args);
		ApiBaseResponder.sendJSON(context.req, context.res, result);
	} catch (e) {
		// console.error(e);
		log.error(e);
		ApiBaseResponder.sendError(context.req, context.res, e);
	}
}
