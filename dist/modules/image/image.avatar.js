import { AvatarGenerator } from './avatar-generator';
export class AvatarGen {
    constructor() {
        this.avatar = new AvatarGenerator();
    }
    async generate(id) {
        const image = await this.avatar.generate(id, 'parts');
        return image.png().toBuffer();
    }
}
//# sourceMappingURL=image.avatar.js.map