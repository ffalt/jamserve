import {AvatarGenerator, defaultAvatarSettings} from './avatar-generator/avatar-generator';

export class AvatarGen {
	avatar: AvatarGenerator;

	constructor(avatarPartsLocation?: string) {
		if (avatarPartsLocation) {
			defaultAvatarSettings.partsLocation = avatarPartsLocation;
		}
		this.avatar = new AvatarGenerator(defaultAvatarSettings);
	}

	public async generate(id: string): Promise<Buffer> {
		const image = await this.avatar.generate(id, 'parts');
		return image.png().toBuffer();
	}
}
