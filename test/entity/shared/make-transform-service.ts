import { jest } from '@jest/globals';

export function makeTransformService<T extends object>(
	ServiceClass: new () => T,
	extInfoKey: string
) {
	const service = new ServiceClass();
	const metaData = {
		extInfo: { [extInfoKey]: jest.fn().mockResolvedValue({ description: 'mock info' } as never) }
	};
	const Genre = {
		genreBases: jest.fn().mockResolvedValue([] as never)
	};
	(service as never as { metaData: unknown }).metaData = metaData;
	(service as never as { Genre: unknown }).Genre = Genre;
	return {
		service,
		metaData: metaData as { extInfo: Record<string, ReturnType<typeof jest.fn>> },
		Genre
	};
}
