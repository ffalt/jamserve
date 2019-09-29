import * as TJS from 'typescript-json-schema';

export interface Definition extends TJS.Definition {
	type?: string;
	properties?: {
		[key: string]: Definition;
	};
	items?: Definition;
	additionalProperties?: Definition;
	definitions?: {
		[key: string]: Definition;
	};
}

export interface Definitions {
	[name: string]: Definition;
}
