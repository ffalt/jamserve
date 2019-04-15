/*
 * avatar-generator
 * https://github.com/arusanov/avatar-generator
 *
 * Copyright (c) 2018 arusanov
 * Licensed under the MIT license.
 */

/* This is included because jamserve uses a newer version of sharp */

import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import seedrandom from 'seedrandom';

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

const defaultSettings: AvatarGenearatorSettings = {
	parts: ['background', 'face', 'clothes', 'head', 'hair', 'eye', 'mouth'],
	partsLocation: path.join(__dirname),
	imageExtension: '.png'
};

type PartsMap = { [key in AvatarPart]: string[] };

interface VariantsMap {
	[key: string]: PartsMap;
}

class AvatarGenerator {
	private _variants: VariantsMap;
	private _parts: Array<AvatarPart>;

	constructor(settings: Partial<AvatarGenearatorSettings> = {}) {
		const cfg = {
			...defaultSettings,
			...settings
		};
		this._variants = AvatarGenerator.BuildVariantsMap(cfg);
		this._parts = cfg.parts;
	}

	get variants() {
		return Object.keys(this._variants);
	}

	private static BuildVariantsMap({
										parts,
										partsLocation,
										imageExtension
									}: AvatarGenearatorSettings) {
		const fileRegex = new RegExp(`(${parts.join('|')})(\\d+)${imageExtension}`);
		const discriminators = fs
			.readdirSync(partsLocation)
			.filter((partsDir) =>
				fs.statSync(path.join(partsLocation, partsDir)).isDirectory()
			);

		return discriminators.reduce(
			(variants, discriminator) => {
				const dir = path.join(partsLocation, discriminator);
				variants[discriminator] = fs.readdirSync(dir).reduce((ps, fileName) => {
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

	private getParts(id: string, variant: string) {
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
				width: width,
				height: height,
				channels: 4 as 4
			}
		};
		const overlays = parts.map((part) =>
			sharp(part).raw().toBuffer()
		);
		let composite = overlays.shift();
		if (composite) {
			for (const overlay of overlays) {
				const [compoisteData, overlayData]: Array<Buffer> = await Promise.all([composite, overlay]);
				composite = sharp(compoisteData, options)
					.composite([{input: overlayData}])
					.raw().toBuffer();
			}
		}
		return sharp(await composite, options);
	}
}

export class AvatarGen {
	avatar: AvatarGenerator;

	constructor(avatarPartsLocation?: string) {
		if (avatarPartsLocation) {
			defaultSettings.partsLocation = avatarPartsLocation;
		}
		this.avatar = new AvatarGenerator(defaultSettings);
	}

	public async generate(id: string): Promise<Buffer> {
		const image = await this.avatar.generate(id, 'parts');
		return await image.png().toBuffer();
	}
}

