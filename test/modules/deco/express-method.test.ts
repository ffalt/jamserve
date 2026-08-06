import { describe, expect, test } from '@jest/globals';
import express, { Router } from 'express';
import { ExpressMethod, RestOptions, RouteInfo } from '../../../src/modules/deco/express/express-method.js';
import { MethodMetadata } from '../../../src/modules/deco/definitions/method-metadata.js';
import { ControllerClassMetadata } from '../../../src/modules/deco/definitions/controller-metadata.js';
import { MetadataStorage } from '../../../src/modules/deco/definitions/metadata-storage.js';
import { ApiBaseResponder, ApiBinaryResult } from '../../../src/modules/deco/express/express-responder.js';
import { ApiError } from '../../../src/modules/deco/express/express-error.js';
import { ResultClassMetadata } from '../../../src/modules/deco/definitions/object-class-metdata.js';
import { CustomPathParameters } from '../../../src/modules/deco/definitions/types.js';
import { ParameterMetadata } from '../../../src/modules/deco/definitions/parameter-metadata.js';

type CapturedHandler = (req: express.Request, res: express.Response, next: express.NextFunction) => void | Promise<void>;

interface RegisteredRoute {
	route: string;
	handlers: Array<CapturedHandler>;
}

class RecordingResponder extends ApiBaseResponder {
	ok = 0;
	binary: Array<ApiBinaryResult> = [];
	strings: Array<string> = [];
	data: Array<unknown> = [];
	errors: Array<unknown> = [];

	sendBinary(_req: express.Request, _res: express.Response, data: ApiBinaryResult): void {
		this.binary.push(data);
	}

	sendString(_req: express.Request, _res: express.Response, data: string): void {
		this.strings.push(data);
	}

	sendData(_req: express.Request, _res: express.Response, data: unknown): void {
		this.data.push(data);
	}

	sendOK(_req: express.Request, _res: express.Response): void {
		this.ok++;
	}

	sendError(_req: express.Request, _res: express.Response, error: unknown): void {
		this.errors.push(error);
	}

	firstError(): ApiError {
		return this.errors[0] as ApiError;
	}
}

class RecordingRouter {
	posts: Array<RegisteredRoute> = [];
	gets: Array<RegisteredRoute> = [];
	alls: Array<RegisteredRoute> = [];

	post(route: string, ...handlers: Array<CapturedHandler>): void {
		this.posts.push({ route, handlers });
	}

	get(route: string, ...handlers: Array<CapturedHandler>): void {
		this.gets.push({ route, handlers });
	}

	all(route: string, ...handlers: Array<CapturedHandler>): void {
		this.alls.push({ route, handlers });
	}

	asRouter(): Router {
		return this as unknown as Router;
	}
}

class ResultDto {
	value?: string;
}

class UnregisteredDto {
	value?: string;
}

class TestTarget {
}

const METHOD_NAME = 'call';

function buildMethod(overrides: Partial<MethodMetadata> = {}): MethodMetadata {
	return {
		methodName: METHOD_NAME,
		schemaName: METHOD_NAME,
		target: TestTarget,
		example: undefined,
		parameters: [],
		...overrides
	};
}

function buildController(implementation: (...arguments_: Array<unknown>) => unknown, overrides: Partial<ControllerClassMetadata> = {}): ControllerClassMetadata {
	class Ctrl {
	}

	(Ctrl.prototype as Record<string, unknown>)[METHOD_NAME] = implementation;
	return { target: Ctrl, name: 'Ctrl', route: '/ctrl', ...overrides };
}

function resultTypeOf(target: Function): ResultClassMetadata {
	return { name: target.name, target, fields: [], interfaceClasses: undefined };
}

function buildOptions(overrides: Partial<RestOptions> = {}): RestOptions {
	return {
		validateRoles: () => true,
		tmpPath: 'local/__tests__/express-method',
		resultTypes: [],
		enums: [],
		responder: new RecordingResponder(),
		...overrides
	};
}

function responderOf(options: RestOptions): RecordingResponder {
	return options.responder as RecordingResponder;
}

function buildRequest(overrides: Record<string, unknown> = {}): express.Request {
	return {
		user: undefined,
		params: {},
		query: {},
		body: {},
		orm: 'orm-value',
		engine: 'engine-value',
		...overrides
	} as unknown as express.Request;
}

const noopResponse = {} as express.Response;

const noopNext: express.NextFunction = () => undefined;

function contextParameter(propertyName: string, index: number): ParameterMetadata {
	return { kind: 'context', propertyName, index, target: TestTarget, methodName: METHOD_NAME };
}

function fileParameter(name: string, index: number): ParameterMetadata {
	return {
		kind: 'arg',
		mode: 'file',
		name,
		propertyName: undefined,
		index,
		target: TestTarget,
		methodName: METHOD_NAME,
		getType: () => String,
		typeOptions: {},
		validate: undefined
	};
}

const noopUploadHandler = (): express.RequestHandler => (_req, _res, next) => {
	next();
};

function registerGet(get: MethodMetadata, options: RestOptions, ctrl?: ControllerClassMetadata): { info: RouteInfo; router: RecordingRouter } {
	const router = new RecordingRouter();
	get.controllerClassMetadata = ctrl;
	const info = new ExpressMethod().GET(get, ctrl, router.asRouter(), options, new MetadataStorage());
	return { info, router };
}

function registerPost(
	post: MethodMetadata, options: RestOptions, ctrl?: ControllerClassMetadata,
	uploadHandler: (field: string, autoClean?: boolean) => express.RequestHandler = noopUploadHandler
): { info: RouteInfo; router: RecordingRouter } {
	const router = new RecordingRouter();
	post.controllerClassMetadata = ctrl;
	const info = new ExpressMethod().POST(post, ctrl, router.asRouter(), options, uploadHandler, new MetadataStorage());
	return { info, router };
}

function registerSubsonic(get: MethodMetadata, options: RestOptions, ctrl?: ControllerClassMetadata): { info: RouteInfo; router: RecordingRouter } {
	const router = new RecordingRouter();
	get.controllerClassMetadata = ctrl;
	const info = new ExpressMethod().SUBSONIC(get, ctrl, router.asRouter(), options, new MetadataStorage());
	return { info, router };
}

function lastHandler(route: RegisteredRoute): CapturedHandler {
	return route.handlers.at(-1)!;
}

function singlePathParameters(getType: () => Function): CustomPathParameters {
	return {
		regex: /^([^/]+)$/,
		groups: [{ name: 'id', getType }]
	};
}

describe('ExpressMethod', () => {
	describe('result format', () => {
		test('should report binary for a binary method', () => {
			const { info } = registerGet(buildMethod({ binary: ['image/png'], getReturnType: () => ResultDto }), buildOptions());
			expect(info.format).toBe('binary');
		});

		test('should report void for a method without a return type', () => {
			const { info } = registerGet(buildMethod(), buildOptions());
			expect(info.format).toBe('void');
		});

		test('should report string for a method returning String', () => {
			const { info } = registerGet(buildMethod({ getReturnType: () => String }), buildOptions());
			expect(info.format).toBe('string');
		});

		test('should report json for a method returning a result type', () => {
			const { info } = registerGet(buildMethod({ getReturnType: () => ResultDto }), buildOptions());
			expect(info.format).toBe('json');
		});

		test('should report the declared default return type format', () => {
			const { info } = registerGet(buildMethod({ getReturnType: () => ResultDto, defaultReturnTypeFormat: 'xml' }), buildOptions());
			expect(info.format).toBe('xml');
		});
	});

	describe('route info', () => {
		test('should default the route to the controller root', () => {
			const { info, router } = registerGet(buildMethod(), buildOptions(), buildController(() => undefined));
			expect(router.gets[0].route).toBe('/');
			expect(info.endpoint).toBe('/ctrl/');
			expect(info.method).toBe('GET');
		});

		test('should build the endpoint without a controller', () => {
			const { info } = registerGet(buildMethod({ route: '/state' }), buildOptions());
			expect(info.endpoint).toBe('/state');
		});

		test('should report public when no roles are declared', () => {
			const { info } = registerGet(buildMethod(), buildOptions());
			expect(info.role).toBe('public');
		});

		test('should join the declared method roles', () => {
			const { info } = registerGet(buildMethod({ roles: ['admin', 'stream'] }), buildOptions());
			expect(info.role).toBe('admin,stream');
		});

		test('should fall back to the controller roles', () => {
			const ctrl = buildController(() => undefined, { roles: ['podcast'] });
			const { info } = registerGet(buildMethod(), buildOptions(), ctrl);
			expect(info.role).toBe('podcast');
		});

		test('should rewrite a route with custom path parameters', () => {
			const { info, router } = registerGet(
				buildMethod({ route: '/download{format}', customPathParameters: singlePathParameters(() => String) }),
				buildOptions()
			);
			expect(router.gets[0].route).toBe('/download:pathParameters');
			expect(info.endpoint).toBe('/download:pathParameters');
		});

		test('should rewrite a missing route with custom path parameters', () => {
			const { router } = registerGet(
				buildMethod({ customPathParameters: singlePathParameters(() => String) }),
				buildOptions()
			);
			expect(router.gets[0].route).toBe('/:pathParameters');
		});
	});

	describe('GET handler', () => {
		test('should reject an unauthorized request', async () => {
			const options = buildOptions({ validateRoles: () => false });
			const { router } = registerGet(buildMethod({ roles: ['admin'] }), options, buildController(() => undefined));
			await lastHandler(router.gets[0])(buildRequest(), noopResponse, noopNext);

			const responder = responderOf(options);
			expect(responder.errors).toHaveLength(1);
			expect(responder.firstError()).toBeInstanceOf(ApiError);
			expect(responder.firstError().failCode).toBe(401);
			expect(responder.ok).toBe(0);
		});

		test('should pass the declared roles to the role validation', async () => {
			const seen: Array<Array<string>> = [];
			const options = buildOptions({
				validateRoles: (_user, roles) => {
					seen.push(roles);
					return true;
				}
			});
			const { router } = registerGet(buildMethod({ roles: ['admin'] }), options, buildController(() => undefined));
			await lastHandler(router.gets[0])(buildRequest(), noopResponse, noopNext);

			expect(seen).toEqual([['admin']]);
		});

		test('should send OK for a method without a return type', async () => {
			const options = buildOptions();
			const { router } = registerGet(buildMethod(), options, buildController(() => undefined));
			await lastHandler(router.gets[0])(buildRequest(), noopResponse, noopNext);

			expect(responderOf(options).ok).toBe(1);
			expect(responderOf(options).errors).toHaveLength(0);
		});

		test('should send a string result', async () => {
			const options = buildOptions();
			const { router } = registerGet(buildMethod({ getReturnType: () => String }), options, buildController(() => 'hello'));
			await lastHandler(router.gets[0])(buildRequest(), noopResponse, noopNext);

			expect(responderOf(options).strings).toEqual(['hello']);
		});

		test('should send a binary result', async () => {
			const options = buildOptions();
			const binaryResult: ApiBinaryResult = { json: { a: 1 } };
			const { router } = registerGet(buildMethod({ binary: ['image/png'] }), options, buildController(() => binaryResult));
			await lastHandler(router.gets[0])(buildRequest(), noopResponse, noopNext);

			expect(responderOf(options).binary).toEqual([binaryResult]);
		});

		test('should send a registered result type', async () => {
			const options = buildOptions({ resultTypes: [resultTypeOf(ResultDto)] });
			const { router } = registerGet(buildMethod({ getReturnType: () => ResultDto }), options, buildController(() => ({ value: 'x' })));
			await lastHandler(router.gets[0])(buildRequest(), noopResponse, noopNext);

			expect(responderOf(options).data).toEqual([{ value: 'x' }]);
		});

		test('should fail for a return type that is not a registered result type', async () => {
			const options = buildOptions({ resultTypes: [resultTypeOf(ResultDto)] });
			const { router } = registerGet(buildMethod({ getReturnType: () => UnregisteredDto }), options, buildController(() => ({})));
			await lastHandler(router.gets[0])(buildRequest(), noopResponse, noopNext);

			const responder = responderOf(options);
			expect(responder.data).toHaveLength(0);
			expect(responder.firstError().failCode).toBe(500);
			expect(responder.firstError().message).toContain('@ResultType');
		});

		test('should fail when the controller metadata is missing', async () => {
			const options = buildOptions();
			const router = new RecordingRouter();
			new ExpressMethod().GET(buildMethod(), undefined, router.asRouter(), options, new MetadataStorage());
			await lastHandler(router.gets[0])(buildRequest(), noopResponse, noopNext);

			const responder = responderOf(options);
			expect(responder.firstError().failCode).toBe(500);
			expect(responder.firstError().message).toContain('Invalid controller');
		});

		test('should forward an error thrown by the controller', async () => {
			const options = buildOptions();
			const failure = new Error('controller exploded');
			const { router } = registerGet(buildMethod({ getReturnType: () => String }), options, buildController(() => {
				throw failure;
			}));
			await lastHandler(router.gets[0])(buildRequest(), noopResponse, noopNext);

			expect(responderOf(options).errors).toEqual([failure]);
		});

		test('should forward a rejected controller promise', async () => {
			const options = buildOptions();
			const failure = new Error('controller rejected');
			const { router } = registerGet(buildMethod({ getReturnType: () => String }), options, buildController(async () => {
				await Promise.resolve();
				throw failure;
			}));
			await lastHandler(router.gets[0])(buildRequest(), noopResponse, noopNext);

			expect(responderOf(options).errors).toEqual([failure]);
		});
	});

	describe('custom path parameters', () => {
		test('should replace the raw path parameters with the parsed ones', async () => {
			const options = buildOptions();
			const get = buildMethod({ route: '/id{id}', customPathParameters: singlePathParameters(() => String) });
			const { router } = registerGet(get, options, buildController(() => undefined));
			const request = buildRequest({ params: { pathParameters: 'abc' } });
			await lastHandler(router.gets[0])(request, noopResponse, noopNext);

			expect(request.params.id).toBe('abc');
			expect(request.params.pathParameters).toBeUndefined();
			expect(responderOf(options).ok).toBe(1);
		});

		test('should fail on an invalid custom path parameter', async () => {
			const options = buildOptions();
			const get = buildMethod({ route: '/id{id}', customPathParameters: singlePathParameters(() => Number) });
			const { router } = registerGet(get, options, buildController(() => undefined));
			await lastHandler(router.gets[0])(buildRequest({ params: { pathParameters: 'not-a-number' } }), noopResponse, noopNext);

			const responder = responderOf(options);
			expect(responder.ok).toBe(0);
			expect(responder.firstError().failCode).toBe(422);
		});

		test('should fail on a missing custom path parameter', async () => {
			const options = buildOptions();
			const get = buildMethod({ route: '/id{id}', customPathParameters: singlePathParameters(() => String) });
			const { router } = registerGet(get, options, buildController(() => undefined));
			await lastHandler(router.gets[0])(buildRequest({ params: { pathParameters: '' } }), noopResponse, noopNext);

			const responder = responderOf(options);
			expect(responder.ok).toBe(0);
			expect(responder.firstError().failCode).toBe(400);
		});
	});

	describe('parameter building', () => {
		test('should pass the parameters in declaration index order', async () => {
			const options = buildOptions();
			let received: Array<unknown> = [];
			const get = buildMethod({ parameters: [contextParameter('engine', 1), contextParameter('orm', 0)] });
			const { router } = registerGet(get, options, buildController((...arguments_) => {
				received = arguments_;
			}));
			await lastHandler(router.gets[0])(buildRequest(), noopResponse, noopNext);

			expect(received).toEqual(['orm-value', 'engine-value']);
		});

		test('should provide the whole context to a context parameter without a property name', async () => {
			const options = buildOptions();
			let received: Array<unknown> = [];
			const get = buildMethod({
				parameters: [{ kind: 'context', propertyName: undefined, index: 0, target: TestTarget, methodName: METHOD_NAME }]
			});
			const { router } = registerGet(get, options, buildController((...arguments_) => {
				received = arguments_;
			}));
			const request = buildRequest({ user: { name: 'jane' } });
			await lastHandler(router.gets[0])(request, noopResponse, noopNext);

			expect(received).toHaveLength(1);
			expect(received[0]).toEqual(expect.objectContaining({ req: request, orm: 'orm-value', engine: 'engine-value', user: { name: 'jane' } }));
		});

		test('should skip a parameter that resolves to nothing', async () => {
			const options = buildOptions();
			let received: Array<unknown> = [];
			const get = buildMethod({ parameters: [contextParameter('client', 0)] });
			const { router } = registerGet(get, options, buildController((...arguments_) => {
				received = arguments_;
			}));
			await lastHandler(router.gets[0])(buildRequest(), noopResponse, noopNext);

			expect(received).toEqual([]);
		});
	});

	describe('POST', () => {
		test('should register a POST route', () => {
			const { info, router } = registerPost(buildMethod({ route: '/create' }), buildOptions(), buildController(() => undefined));
			expect(info.method).toBe('POST');
			expect(info.endpoint).toBe('/ctrl/create');
			expect(router.posts).toHaveLength(1);
			expect(router.posts[0].handlers).toHaveLength(1);
		});

		test('should add an upload handler per file parameter', () => {
			const fields: Array<string> = [];
			const uploadHandler = (field: string): express.RequestHandler => {
				fields.push(field);
				return (_req, _res, next) => {
					next();
				};
			};
			const post = buildMethod({ parameters: [fileParameter('image', 0), fileParameter('cover', 1)] });
			const { router } = registerPost(post, buildOptions(), buildController(() => undefined), uploadHandler);

			expect(fields).toEqual(['image', 'cover']);
			// authorization guard + two upload handlers + route handler
			expect(router.posts[0].handlers).toHaveLength(4);
		});

		test('should authorize before the upload handler runs', async () => {
			let uploadCalled = false;
			const uploadHandler = (): express.RequestHandler => (_req, _res, next) => {
				uploadCalled = true;
				next();
			};
			const options = buildOptions({ validateRoles: () => false });
			const post = buildMethod({ roles: ['admin'], parameters: [fileParameter('image', 0)] });
			const { router } = registerPost(post, options, buildController(() => undefined), uploadHandler);

			let nextCalled = false;
			await router.posts[0].handlers[0](buildRequest(), noopResponse, () => {
				nextCalled = true;
			});

			expect(nextCalled).toBe(false);
			expect(uploadCalled).toBe(false);
			const responder = responderOf(options);
			expect(responder.errors).toHaveLength(1);
			expect(responder.firstError().failCode).toBe(401);
		});

		test('should pass an authorized request on to the upload handler', async () => {
			const options = buildOptions({ validateRoles: () => true });
			const post = buildMethod({ roles: ['admin'], parameters: [fileParameter('image', 0)] });
			const { router } = registerPost(post, options, buildController(() => undefined));

			let nextCalled = false;
			await router.posts[0].handlers[0](buildRequest({ user: { roleAdmin: true } }), noopResponse, () => {
				nextCalled = true;
			});

			expect(nextCalled).toBe(true);
			expect(responderOf(options).errors).toHaveLength(0);
		});

		test('should not add an authorization guard to a route without an upload', () => {
			const options = buildOptions({ validateRoles: () => false });
			const { router } = registerPost(buildMethod({ roles: ['admin'] }), options, buildController(() => undefined));

			expect(router.posts[0].handlers).toHaveLength(1);
		});

		test('should still reject an unauthorized request in the route handler', async () => {
			const options = buildOptions({ validateRoles: () => false });
			const { router } = registerPost(buildMethod({ roles: ['admin'] }), options, buildController(() => undefined));
			await lastHandler(router.posts[0])(buildRequest(), noopResponse, noopNext);

			expect(responderOf(options).firstError().failCode).toBe(401);
		});

		test('should call the controller method', async () => {
			const options = buildOptions({ resultTypes: [resultTypeOf(ResultDto)] });
			const post = buildMethod({ route: '/create', getReturnType: () => ResultDto });
			const { router } = registerPost(post, options, buildController(() => ({ value: 'created' })));
			await lastHandler(router.posts[0])(buildRequest(), noopResponse, noopNext);

			expect(responderOf(options).data).toEqual([{ value: 'created' }]);
		});

		test('should rewrite a missing route with custom path parameters', () => {
			const post = buildMethod({ customPathParameters: singlePathParameters(() => String) });
			const { info, router } = registerPost(post, buildOptions());

			expect(router.posts[0].route).toBe('/:pathParameters');
			expect(info.endpoint).toBe('/:pathParameters');
		});

		test('should apply custom path parameters', async () => {
			const options = buildOptions();
			const post = buildMethod({ route: '/id{id}', customPathParameters: singlePathParameters(() => String) });
			const { router, info } = registerPost(post, options, buildController(() => undefined));
			const request = buildRequest({ params: { pathParameters: 'xyz' } });
			await lastHandler(router.posts[0])(request, noopResponse, noopNext);

			expect(info.endpoint).toBe('/ctrl/id:pathParameters');
			expect(request.params.id).toBe('xyz');
			expect(request.params.pathParameters).toBeUndefined();
		});
	});

	describe('SUBSONIC', () => {
		test('should register a catch-all route with a view suffix', () => {
			const { info, router } = registerSubsonic(buildMethod({ route: '/ping' }), buildOptions(), buildController(() => undefined));

			expect(router.alls).toHaveLength(1);
			expect(router.alls[0].route).toBe('/ping{.view}');
			expect(info.method).toBe('ALL');
			expect(info.endpoint).toBe('/ctrl/ping');
		});

		test('should rewrite a route with custom path parameters', () => {
			const { router } = registerSubsonic(
				buildMethod({ route: '/stream{id}', customPathParameters: singlePathParameters(() => String) }),
				buildOptions(),
				buildController(() => undefined)
			);
			expect(router.alls[0].route).toBe('/stream:pathParameters{.view}');
		});

		test('should rewrite a missing route with custom path parameters', () => {
			const get = buildMethod({ customPathParameters: singlePathParameters(() => String) });
			const { info, router } = registerSubsonic(get, buildOptions());

			expect(router.alls[0].route).toBe('/:pathParameters{.view}');
			expect(info.endpoint).toBe('/:pathParameters');
		});

		test('should reject an unauthorized request', async () => {
			const options = buildOptions({ validateRoles: () => false });
			const { router } = registerSubsonic(buildMethod({ roles: ['stream'] }), options, buildController(() => undefined));
			await lastHandler(router.alls[0])(buildRequest(), noopResponse, noopNext);

			expect(responderOf(options).firstError().failCode).toBe(401);
		});

		test('should call the controller method', async () => {
			const options = buildOptions({ resultTypes: [resultTypeOf(ResultDto)] });
			const get = buildMethod({ route: '/ping', getReturnType: () => ResultDto });
			const { router } = registerSubsonic(get, options, buildController(() => ({ value: 'pong' })));
			await lastHandler(router.alls[0])(buildRequest(), noopResponse, noopNext);

			expect(responderOf(options).data).toEqual([{ value: 'pong' }]);
		});

		test('should apply custom path parameters', async () => {
			const options = buildOptions();
			const get = buildMethod({ route: '/id{id}', customPathParameters: singlePathParameters(() => String) });
			const { router } = registerSubsonic(get, options, buildController(() => undefined));
			const request = buildRequest({ params: { pathParameters: 'sub' } });
			await lastHandler(router.alls[0])(request, noopResponse, noopNext);

			expect(request.params.id).toBe('sub');
			expect(responderOf(options).ok).toBe(1);
		});
	});
});
