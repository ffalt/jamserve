export interface ControllerClassMetadata {
	target: NewableFunction;
	name: string;
	abstract?: boolean;
	description?: string;
	roles?: Array<string>;
	tags?: Array<string>;
	deprecationReason?: string;
	route: string;
}
