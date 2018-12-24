import moment from 'moment';
import {ChatConfig} from '../../config';
import {ChatMessage} from './chat.model';
import {User} from '../../objects/user/user.model';

export class ChatService {
	private messages: Array<ChatMessage> = [];
	private duration: moment.Duration;

	constructor(private chatConfig: ChatConfig) {
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
		if (this.messages.length > this.chatConfig.maxMsgs) {
			this.messages.shift();
		}
		return c;
	}

}
