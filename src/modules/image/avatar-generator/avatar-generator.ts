/***
 * avatar-generator
 * https://github.com/arusanov/avatar-generator
 *
 * Copyright (c) 2018 arusanov
 * Licensed under the MIT license.
 */

/* This is included because jamserve uses a newer version of sharp */

import fs from 'fs';
import path from 'path';
import seedrandom from 'seedrandom';
import sharp from 'sharp';

export type AvatarPart =
	| 'background'
	| 'face'
	| 'clothes'
	| 'head'
	| 'hair'
	| 'eye'
	| 'mouth';

export interface AvatarGenearatorSettings {
	parts: Array<AvatarPart>;
	imageExtension: string;
	partsLocation: string;
}

export const defaultAvatarSettings: AvatarGenearatorSettings = {
	parts: ['background', 'face', 'clothes', 'head', 'hair', 'eye', 'mouth'],
	partsLocation: path.join(__dirname),
	imageExtension: '.png'
};

type PartsMap = { [key in AvatarPart]: Array<string> };

interface VariantsMap {
	[key: string]: PartsMap;
}

export class AvatarGenerator {
	private readonly _variants: VariantsMap;
	private _parts: Array<AvatarPart>;

	constructor(settings: Partial<AvatarGenearatorSettings> = {}) {
		const cfg = {
			...defaultAvatarSettings,
			...settings
		};
		this._variants = AvatarGenerator.BuildVariantsMap(cfg);
		this._parts = cfg.parts;
	}

	get variants(): Array<string> {
		return Object.keys(this._variants);
	}

	private static BuildVariantsMap({parts, partsLocation, imageExtension}: AvatarGenearatorSettings): VariantsMap {
		const fileRegex = new RegExp(`(${parts.join('|')})(\\d+)${imageExtension}`);
		const discriminators = fs
			.readdirSync(partsLocation)
			.filter(partsDir =>
				fs.statSync(path.join(partsLocation, partsDir)).isDirectory()
			);

		return discriminators.reduce(
			(variants, discriminator) => {
				const dir = path.join(partsLocation, discriminator);
				variants[discriminator] = fs.readdirSync(dir).reduce((ps: PartsMap, fileName: string) => {
						const match = fileRegex.exec(fileName);
						if (match) {
							const part = match[1] as AvatarPart;
							if (!ps[part]) {
								ps[part] = [];
							}
							ps[part][Number(match[2])] = path.join(dir, fileName);
						}
						return ps;
					},
					{} as PartsMap
				);
				return variants;
			},
			{} as VariantsMap
		);
	}

	private getParts(id: string, variant: string): Array<string> {
		const variantParts = this._variants[variant];
		if (!variantParts) {
			throw new Error(
				`variant '${variant}' is not supported. Supported variants: ${Object.keys(
					this._variants
				)}`
			);
		}
		const rng = seedrandom(id);
		return this._parts
			.map(
				(partName: AvatarPart): string => {
					const partVariants = variantParts[partName];
					return (
						partVariants &&
						partVariants[Math.floor(rng() * partVariants.length)]
					);
				}
			)
			.filter(Boolean);
	}

	public async generate(id: string, variant: string): Promise<sharp.Sharp> {
		const parts = this.getParts(id, variant);
		if (!parts.length) {
			throw new Error(`variant '${variant}'does not contain any parts`);
		}
		const {width, height} = await sharp(parts[0]).metadata();
		if (width === undefined || height === undefined) {
			throw new Error(`Invalid part file found`);
		}
		const options = {
			raw: {
				width,
				height,
				channels: 4 as 4
			}
		};
		const composite = parts.shift();
		if (!composite) {
			throw new Error(`variant '${variant}'does not contain any parts`);
		}
		return sharp(composite, options)
			.composite(parts.map(p => {
				return {input: p};
			}));
	}
}
