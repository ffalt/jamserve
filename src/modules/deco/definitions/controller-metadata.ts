export interface ControllerClassMetadata {
	target: Function;
	name: string;
	abstract?: boolean;
	description?: string;
	roles?: Array<string>;
	tags?: Array<string>;
	deprecationReason?: string;
	route: string;
}
