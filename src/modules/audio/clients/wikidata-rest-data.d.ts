export declare namespace WikiData {

	export interface SiteLink {
		site: string;
		title: string;
		badges: Array<string>;
	}

	export interface Snak {
		snaktype: string;
		property: string;
		hash: string;
		datatype: string;
		datavalue: {
			type: string;
			value: {
				'id': string;
				'entity-type': string;
				'numeric-id': number;
			} | string;
		};
	}

	export interface Claim {
		mainsnak: Snak;
		id: string;
		type: string;
		rank: string;
		references: Array<{
			hash: string;
			snaks: Record<string, Array<Snak>>;
			snakorder: Array<string>;
		}>;
	}

	export interface Entity {
		type: string;
		id: string;
		labels: Record<string, { language: string; value: string }>;
		aliases: Record<string, { language: string; value: string }>;
		descriptions: Record<string, { language: string; value: string }>;
		sitelinks: Record<string, SiteLink>;
		claims: Record<string, Array<Claim>>;
	}

	export interface Response {
		entities: Record<string, Entity>;
	}

}
