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
				id: string;
				'entity-type': string;
				'numeric-id': number;
			}
		};
	}

	export interface Claim {
		mainsnak: Snak;
		id: string;
		type: string;
		rank: string;
		references: Array<{
			hash: string;
			snaks: {
				[name: string]: Array<Snak>;
			};
			snakorder: Array<string>;
		}>;
	}

	export interface Entity {
		type: string;
		id: string;
		labels: {
			[language: string]: {
				language: string;
				value: string;
			};
		};
		aliases: {
			[language: string]: {
				language: string;
				value: string;
			};
		};
		descriptions: {
			[language: string]: {
				language: string;
				value: string;
			};
		};
		sitelinks: {
			[name: string]: SiteLink;
		};
		claims: {
			[name: string]: Array<Claim>;
		};
	}

	export interface Response {
		entities: {
			[id: string]: Entity;
		};
	}

}
