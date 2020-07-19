"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvatarGen = void 0;
const avatar_generator_1 = require("./avatar-generator");
class AvatarGen {
    constructor() {
        this.avatar = new avatar_generator_1.AvatarGenerator();
    }
    async generate(id) {
        const image = await this.avatar.generate(id, 'parts');
        return image.png().toBuffer();
    }
}
exports.AvatarGen = AvatarGen;
//# sourceMappingURL=image.avatar.js.map