import moment from 'moment';
import {ChatMessage} from './chat.model';
import {User} from '../../objects/user/user.model';
import {Jam} from '../../model/jam-rest-data';

export class ChatService {
	private messages: Array<ChatMessage> = [];
	private duration: moment.Duration = moment.duration(0, 's');
	private chatConfig: Jam.AdminSettingsChat = {maxMessages: 0, maxAge: {value: 0, unit: 's'}};

	constructor() {
	}

	setSettings(chatConfig: Jam.AdminSettingsChat) {
		this.chatConfig = chatConfig;
		this.duration = moment.duration(this.chatConfig.maxAge.value, <moment.unitOfTime.Base>this.chatConfig.maxAge.unit);
	}

	async cleanOld(): Promise<void> {
		const d = moment().subtract(this.duration).valueOf();
		this.messages = this.messages.filter(c => d < c.time);
	}

	async find(time: number): Promise<ChatMessage | undefined> {
		return this.messages.find(msg => msg.time === time);
	}

	async remove(message: ChatMessage): Promise<void> {
		this.messages = this.messages.filter(msg => msg.time !== message.time);
	}

	async get(since?: number): Promise<Array<ChatMessage>> {
		await this.cleanOld();
		let list: Array<ChatMessage> = this.messages;
		if (since !== undefined && !isNaN(since)) {
			list = list.filter(msg => msg.time > since);
		}
		return list;
	}

	async add(message: string, user: User): Promise<ChatMessage> {
		await this.cleanOld();
		const c = {
			message: message,
			time: Date.now(),
			username: user.name,
			userID: user.id
		};
		this.messages.push(c);
		if (this.messages.length > this.chatConfig.maxMessages) {
			this.messages.shift();
		}
		return c;
	}

}
