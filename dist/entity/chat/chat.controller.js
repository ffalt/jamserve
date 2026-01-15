var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { UserRole } from '../../types/enums.js';
import { Chat } from './chat.model.js';
import { ChatCreateParameters, ChatFilterParameters, ChatRemoveParameters } from './chat.parameters.js';
import { Controller } from '../../modules/rest/decorators/controller.js';
import { Get } from '../../modules/rest/decorators/get.js';
import { QueryParameters } from '../../modules/rest/decorators/query-parameters.js';
import { RestContext } from '../../modules/rest/decorators/rest-context.js';
import { Post } from '../../modules/rest/decorators/post.js';
import { BodyParameters } from '../../modules/rest/decorators/body-parameters.js';
let ChatController = class ChatController {
    async list({ since }, { engine }) {
        return engine.transform.Chat.chats(await engine.chat.get(since));
    }
    async create({ message }, { engine, user }) {
        await engine.chat.add(message, user);
    }
    async remove({ time }, { engine, user }) {
        const chat = await engine.chat.find(time);
        if (chat?.userID === user.id) {
            await engine.chat.remove(chat);
        }
    }
};
__decorate([
    Get('/list', () => [Chat], { description: 'Get Chat Messages', summary: 'Get Chat' }),
    __param(0, QueryParameters()),
    __param(1, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ChatFilterParameters, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "list", null);
__decorate([
    Post('/create', { description: 'Post a Chat Message', summary: 'Post Chat' }),
    __param(0, BodyParameters()),
    __param(1, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ChatCreateParameters, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "create", null);
__decorate([
    Post('/remove', { description: 'Remove a Chat Message', summary: 'Remove Chat' }),
    __param(0, BodyParameters()),
    __param(1, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ChatRemoveParameters, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "remove", null);
ChatController = __decorate([
    Controller('/chat', { tags: ['Chat'], roles: [UserRole.stream] })
], ChatController);
export { ChatController };
//# sourceMappingURL=chat.controller.js.map