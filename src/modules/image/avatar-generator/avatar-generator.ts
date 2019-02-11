/*
 * avatar-generator
 * https://github.com/arusanov/avatar-generator
 *
 * Copyright (c) 2018 arusanov
 * Licensed under the MIT license.
 */

/*
  Modified to work with jimp instead of sharp and a queer image collection
 */

import path from 'path';
import fse from 'fs-extra';
import seedrandom from 'seedrandom';
import Jimp = require('jimp');

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
	partsLocation: path.join(__dirname, './img'),
	imageExtension: '.png'
};

type PartsMap = { [key in AvatarPart]: string[] };

export class AvatarGenerator {
	private variantParts?: PartsMap;
	private _cfg: AvatarGenearatorSettings;

	constructor(settings: Partial<AvatarGenearatorSettings> = {}) {
		this._cfg = {
			...defaultSettings,
			...settings
		};
	}

	private async buildPartsMap(): Promise<PartsMap> {
		const fileRegex = new RegExp(`(${this._cfg.parts.join('|')})(\\d+)${this._cfg.imageExtension}`);
		const dir = path.resolve(this._cfg.partsLocation);
		const files = (await fse.readdir(dir)).map(filename => path.join(dir, filename));
		files.sort((a, b) => a.localeCompare(b));
		const result: PartsMap = {} as PartsMap;
		for (const filename of files) {
			const match = fileRegex.exec(path.basename(filename));
			if (match) {
				const part = match[1] as AvatarPart;
				if (!result[part]) {
					result[part] = [];
				}
				result[part].push(filename);
			}
		}
		return result;
	}

	private async getParts(id: string): Promise<Array<string>> {
		if (!this.variantParts) {
			this.variantParts = await this.buildPartsMap();
		}
		const variantParts = this.variantParts;
		const rng = seedrandom(id);
		return this._cfg.parts.map((partName: AvatarPart): string => {
				const partVariants = variantParts[partName];
				return (
					partVariants &&
					partVariants[Math.floor(rng() * partVariants.length)]
				);
			}
		).filter(Boolean);
	}

	public async generate(id: string): Promise<Buffer> {
		const parts = await this.getParts(id);
		if (!parts.length) {
			throw new Error(`no parts`);
		}
		const promises = parts.map(filename => Jimp.read(filename));
		const images = await Promise.all(promises);
		let result: Jimp = images[0];
		images.shift();
		for (const image of images) {
			result = await result.composite(image, 0, 0);
		}
		return result.getBufferAsync(Jimp.MIME_PNG);
	}
}
