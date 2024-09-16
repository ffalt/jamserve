import moment from 'moment';
import {Chat} from './chat.js';
import {SettingsService} from '../settings/settings.service.js';
import {User} from '../user/user.js';
import {Inject, InRequestScope} from 'typescript-ioc';

@InRequestScope
export class ChatService {
	@Inject
	private settingsService!: SettingsService;

	private messages: Array<Chat> = [];
	private duration: moment.Duration = moment.duration(0, 's');

	constructor() {
		this.settingsService.registerChangeListener(async () => {
			this.updateSettings();
			await this.cleanOld();
		});
		this.updateSettings();
	}

	updateSettings(): void {
		this.duration = moment.duration(this.settingsService.settings.chat.maxAge.value, this.settingsService.settings.chat.maxAge.unit as moment.unitOfTime.Base);
	}

	async cleanOld(): Promise<void> {
		const d = moment().subtract(this.duration).valueOf();
		this.messages = this.messages.filter(c => d < c.created.valueOf());
	}

	async find(time: number): Promise<Chat | undefined> {
		return this.messages.find(msg => msg.created.valueOf() === time);
	}

	async remove(message: Chat): Promise<void> {
		this.messages = this.messages.filter(msg => msg.created.valueOf() !== message.created.valueOf());
	}

	async get(since?: number): Promise<Array<Chat>> {
		await this.cleanOld();
		let list: Array<Chat> = this.messages;
		if (since !== undefined && !isNaN(since)) {
			list = list.filter(msg => msg.created.valueOf() > since);
		}
		return list;
	}

	async add(message: string, user: User): Promise<Chat> {
		const c: Chat = {
			message,
			created: Date.now(),
			userName: user.name,
			userID: user.id
		};
		this.messages.push(c);
		if (this.messages.length > this.settingsService.settings.chat.maxMessages) {
			this.messages.shift();
		}
		return c;
	}

}
