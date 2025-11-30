/***
 * avatar-generator
 * https://github.com/arusanov/avatar-generator
 *
 * Copyright (c) 2018 arusanov
 * Licensed under the MIT license.
 */

/* This is included because jamserve uses a newer version of sharp */

import fs from 'node:fs';
import path from 'node:path';
import seedrandom from 'seedrandom';
import sharp from 'sharp';

export type AvatarPart = 'background' | 'face' | 'clothes' | 'head' | 'hair' | 'eye' | 'mouth';

export interface AvatarGenearatorSettings {
	parts: Array<AvatarPart>;
	imageExtension: string;
	partsLocation: string;
}

export const defaultAvatarSettings: AvatarGenearatorSettings = {
	parts: ['background', 'face', 'clothes', 'head', 'hair', 'eye', 'mouth'],
	partsLocation: path.resolve('./static/avatar-generator/'),
	imageExtension: '.png'
};

type PartsMap = Record<AvatarPart, Array<string> | undefined>;
type VariantsMap = Record<string, PartsMap | undefined>;

export class AvatarGenerator {
	private readonly _variants: VariantsMap;
	private readonly _parts: Array<AvatarPart>;

	constructor(settings: Partial<AvatarGenearatorSettings> = {}) {
		const cfg = {
			...defaultAvatarSettings,
			...settings
		};
		this._variants = AvatarGenerator.BuildVariantsMap(cfg);
		this._parts = cfg.parts;
	}

	private static BuildVariantsMap({ parts, partsLocation, imageExtension }: AvatarGenearatorSettings): VariantsMap {
		const fileRegex = new RegExp(String.raw`(${parts.join('|')})(\d+)${imageExtension}`);
		const discriminators = fs
			.readdirSync(partsLocation)
			.filter(partsDir =>
				fs.statSync(path.join(partsLocation, partsDir)).isDirectory()
			);

		const variants: VariantsMap = {};
		for (const discriminator of discriminators) {
			const dir = path.join(partsLocation, discriminator);
			const partsMap = {} as PartsMap;
			const files = fs.readdirSync(dir);
			for (const fileName of files) {
				const match = fileRegex.exec(fileName);
				if (match) {
					const match1 = match.at(1);
					const match2 = match.at(2);
					if (match1 && match2) {
						const part = match1 as AvatarPart;
						partsMap[part] ??= [];
						partsMap[part][Number(match2)] = path.join(dir, fileName);
					}
				}
			}
			variants[discriminator] = partsMap;
		}
		return variants;
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
			.map((partName: AvatarPart): string | undefined => {
				const partVariants = variantParts[partName];
				return partVariants ? partVariants[Math.floor(rng() * partVariants.length)] : undefined;
			})
			.filter(part => part !== undefined)
			.filter(Boolean);
	}

	public async generate(id: string, variant: string): Promise<sharp.Sharp> {
		const parts = this.getParts(id, variant);
		const part = parts.at(0);
		if (!part) {
			throw new Error(`variant '${variant}'does not contain any parts`);
		}
		const { width, height } = await sharp(part).metadata();
		const options = {
			raw: {
				width,
				height,
				channels: 4 as const
			}
		};
		const composite = parts.shift();
		if (!composite) {
			throw new Error(`variant '${variant}'does not contain any parts`);
		}
		return sharp(composite, options)
			.composite(parts.map(p => {
				return { input: p };
			}));
	}
}
