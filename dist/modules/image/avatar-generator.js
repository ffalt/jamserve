import fs from 'node:fs';
import path from 'node:path';
import seedrandom from 'seedrandom';
import sharp from 'sharp';
export const defaultAvatarSettings = {
    parts: ['background', 'face', 'clothes', 'head', 'hair', 'eye', 'mouth'],
    partsLocation: path.resolve('./static/avatar-generator/'),
    imageExtension: '.png'
};
export class AvatarGenerator {
    constructor(settings = {}) {
        const cfg = {
            ...defaultAvatarSettings,
            ...settings
        };
        this._variants = AvatarGenerator.BuildVariantsMap(cfg);
        this._parts = cfg.parts;
    }
    static BuildVariantsMap({ parts, partsLocation, imageExtension }) {
        const fileRegex = new RegExp(`(${parts.join('|')})(\\d+)${imageExtension}`);
        const discriminators = fs
            .readdirSync(partsLocation)
            .filter(partsDir => fs.statSync(path.join(partsLocation, partsDir)).isDirectory());
        const variants = {};
        for (const discriminator of discriminators) {
            const dir = path.join(partsLocation, discriminator);
            const partsMap = {};
            const files = fs.readdirSync(dir);
            for (const fileName of files) {
                const match = fileRegex.exec(fileName);
                if (match) {
                    const match1 = match.at(1);
                    const match2 = match.at(2);
                    if (match1 && match2) {
                        const part = match1;
                        partsMap[part] ?? (partsMap[part] = []);
                        partsMap[part][Number(match2)] = path.join(dir, fileName);
                    }
                }
            }
            variants[discriminator] = partsMap;
        }
        return variants;
    }
    getParts(id, variant) {
        const variantParts = this._variants[variant];
        if (!variantParts) {
            throw new Error(`variant '${variant}' is not supported. Supported variants: ${Object.keys(this._variants)}`);
        }
        const rng = seedrandom(id);
        return this._parts
            .map((partName) => {
            const partVariants = variantParts[partName];
            return partVariants ? partVariants[Math.floor(rng() * partVariants.length)] : undefined;
        })
            .filter(part => part !== undefined)
            .filter(Boolean);
    }
    async generate(id, variant) {
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
                channels: 4
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
//# sourceMappingURL=avatar-generator.js.map