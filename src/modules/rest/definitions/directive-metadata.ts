export interface DirectiveMetadata {
	nameOrDefinition: string;
	args: Record<string, any>;
}

export interface DirectiveClassMetadata {
	target: Function;
	directive: DirectiveMetadata;
}

export interface DirectiveFieldMetadata extends DirectiveClassMetadata {
	fieldName: string;
}
