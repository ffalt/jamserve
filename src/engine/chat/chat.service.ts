import moment from 'moment';
import {Jam} from '../../model/jam-rest-data';
import {User} from '../user/user.model';
import {ChatMessage} from './chat.model';

export class ChatService {
	private messages: Array<ChatMessage> = [];
	private duration: moment.Duration = moment.duration(0, 's');
	private chatConfig: Jam.AdminSettingsChat = {maxMessages: 0, maxAge: {value: 0, unit: 's'}};

	setSettings(chatConfig: Jam.AdminSettingsChat): void {
		this.chatConfig = chatConfig;
		this.duration = moment.duration(this.chatConfig.maxAge.value, this.chatConfig.maxAge.unit as moment.unitOfTime.Base);
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
			message,
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
