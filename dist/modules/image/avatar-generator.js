import fs from 'fs';
import path from 'path';
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
        return discriminators.reduce((variants, discriminator) => {
            const dir = path.join(partsLocation, discriminator);
            variants[discriminator] = fs.readdirSync(dir).reduce((ps, fileName) => {
                const match = fileRegex.exec(fileName);
                if (match) {
                    const part = match[1];
                    if (!ps[part]) {
                        ps[part] = [];
                    }
                    ps[part][Number(match[2])] = path.join(dir, fileName);
                }
                return ps;
            }, {});
            return variants;
        }, {});
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
            return (partVariants &&
                partVariants[Math.floor(rng() * partVariants.length)]);
        })
            .filter(Boolean);
    }
    async generate(id, variant) {
        const parts = this.getParts(id, variant);
        if (!parts.length) {
            throw new Error(`variant '${variant}'does not contain any parts`);
        }
        const { width, height } = await sharp(parts[0]).metadata();
        if (width === undefined || height === undefined) {
            throw new Error(`Invalid part file found`);
        }
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