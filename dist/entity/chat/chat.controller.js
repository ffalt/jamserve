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
import { ChatCreateArgs, ChatFilterArgs, ChatRemoveArgs } from './chat.args.js';
import { Controller } from '../../modules/rest/decorators/Controller.js';
import { Get } from '../../modules/rest/decorators/Get.js';
import { QueryParams } from '../../modules/rest/decorators/QueryParams.js';
import { Ctx } from '../../modules/rest/decorators/Ctx.js';
import { Post } from '../../modules/rest/decorators/Post.js';
import { BodyParams } from '../../modules/rest/decorators/BodyParams.js';
let ChatController = class ChatController {
    async list({ since }, { engine }) {
        return engine.transform.Chat.chats(await engine.chat.get(since));
    }
    async create(args, { engine, user }) {
        await engine.chat.add(args.message, user);
    }
    async remove(args, { engine, user }) {
        const chat = await engine.chat.find(args.time);
        if (chat && chat.userID === user.id) {
            await engine.chat.remove(chat);
        }
    }
};
__decorate([
    Get('/list', () => [Chat], { description: 'Get Chat Messages', summary: 'Get Chat' }),
    __param(0, QueryParams()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ChatFilterArgs, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "list", null);
__decorate([
    Post('/create', { description: 'Post a Chat Message', summary: 'Post Chat' }),
    __param(0, BodyParams()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ChatCreateArgs, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "create", null);
__decorate([
    Post('/remove', { description: 'Remove a Chat Message', summary: 'Remove Chat' }),
    __param(0, BodyParams()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ChatRemoveArgs, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "remove", null);
ChatController = __decorate([
    Controller('/chat', { tags: ['Chat'], roles: [UserRole.stream] })
], ChatController);
export { ChatController };
//# sourceMappingURL=chat.controller.js.map