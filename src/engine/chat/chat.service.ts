import moment from 'moment';
import {ChatConfig} from '../../config';
import {ChatMessage} from './chat.model';
import {User} from '../../objects/user/user.model';

export class ChatService {
	private lastCheck = 0;
	private messages: Array<ChatMessage> = [];

	constructor(private chatConfig: ChatConfig) {
	}

	async cleanOld(): Promise<void> {
		const now = (new Date()).valueOf();
		if ((now - (60 * 1000)) > this.lastCheck) {
			this.lastCheck = now;
			const duration = moment.duration(this.chatConfig.maxAge.value, <moment.unitOfTime.Base>this.chatConfig.maxAge.unit);
			const d = moment().subtract(duration).valueOf();
			this.messages = this.messages.filter(c => d < c.time);
		}
	}

	async find(time: number): Promise<ChatMessage | undefined> {
		return this.messages.find(msg => msg.time === time);
	}

	async remove(message: ChatMessage): Promise<void> {
		this.messages = this.messages.filter(msg => msg === message);
	}

	async get(since: number | undefined): Promise<Array<ChatMessage>> {
		await this.cleanOld();
		let list: Array<ChatMessage> = this.messages;
		if (since !== undefined && !isNaN(since)) {
			list = list.filter(msg => msg.time > since);
		}
		return list;
	}

	async add(message: string, user: User): Promise<void> {
		await this.cleanOld();
		const c = {
			message: message,
			time: (new Date()).valueOf(),
			username: user.name,
			userID: user.id
		};
		this.messages.push(c);
		if (this.messages.length > this.chatConfig.maxMsgs) {
			this.messages.shift();
		}
	}

}
