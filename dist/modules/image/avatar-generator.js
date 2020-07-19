"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvatarGenerator = exports.defaultAvatarSettings = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const seedrandom_1 = __importDefault(require("seedrandom"));
const sharp_1 = __importDefault(require("sharp"));
exports.defaultAvatarSettings = {
    parts: ['background', 'face', 'clothes', 'head', 'hair', 'eye', 'mouth'],
    partsLocation: path_1.default.resolve('./static/avatar-generator/'),
    imageExtension: '.png'
};
class AvatarGenerator {
    constructor(settings = {}) {
        const cfg = {
            ...exports.defaultAvatarSettings,
            ...settings
        };
        this._variants = AvatarGenerator.BuildVariantsMap(cfg);
        this._parts = cfg.parts;
    }
    static BuildVariantsMap({ parts, partsLocation, imageExtension }) {
        const fileRegex = new RegExp(`(${parts.join('|')})(\\d+)${imageExtension}`);
        const discriminators = fs_1.default
            .readdirSync(partsLocation)
            .filter(partsDir => fs_1.default.statSync(path_1.default.join(partsLocation, partsDir)).isDirectory());
        return discriminators.reduce((variants, discriminator) => {
            const dir = path_1.default.join(partsLocation, discriminator);
            variants[discriminator] = fs_1.default.readdirSync(dir).reduce((ps, fileName) => {
                const match = fileRegex.exec(fileName);
                if (match) {
                    const part = match[1];
                    if (!ps[part]) {
                        ps[part] = [];
                    }
                    ps[part][Number(match[2])] = path_1.default.join(dir, fileName);
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
        const rng = seedrandom_1.default(id);
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
        const { width, height } = await sharp_1.default(parts[0]).metadata();
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
        return sharp_1.default(composite, options)
            .composite(parts.map(p => {
            return { input: p };
        }));
    }
}
exports.AvatarGenerator = AvatarGenerator;
//# sourceMappingURL=avatar-generator.js.map