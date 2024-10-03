import { AvatarGenerator } from './avatar-generator.js';

export class AvatarGen {
	avatar: AvatarGenerator;

	constructor() {
		this.avatar = new AvatarGenerator();
	}

	public async generate(id: string): Promise<Buffer> {
		const image = await this.avatar.generate(id, 'parts');
		return image.png().toBuffer();
	}
}
