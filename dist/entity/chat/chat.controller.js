"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const typescript_ioc_1 = require("typescript-ioc");
const transform_service_1 = require("../../modules/engine/services/transform.service");
const rest_1 = require("../../modules/rest");
const enums_1 = require("../../types/enums");
const chat_model_1 = require("./chat.model");
const chat_service_1 = require("./chat.service");
const user_1 = require("../user/user");
const chat_args_1 = require("./chat.args");
let ChatController = class ChatController {
    async list({ since }) {
        return this.transform.chats(await this.chatService.get(since));
    }
    async create(args, user) {
        await this.chatService.add(args.message, user);
    }
    async remove(args, user) {
        const chat = await this.chatService.find(args.time);
        if (chat && chat.userID === user.id) {
            await this.chatService.remove(chat);
        }
    }
};
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", transform_service_1.TransformService)
], ChatController.prototype, "transform", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", chat_service_1.ChatService)
], ChatController.prototype, "chatService", void 0);
__decorate([
    rest_1.Get('/list', () => [chat_model_1.Chat], { description: 'Get Chat Messages', summary: 'Get Chat' }),
    __param(0, rest_1.QueryParams()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [chat_args_1.ChatFilterArgs]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "list", null);
__decorate([
    rest_1.Post('/create', { description: 'Post a Chat Message', summary: 'Post Chat' }),
    __param(0, rest_1.BodyParams()),
    __param(1, rest_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [chat_args_1.ChatCreateArgs,
        user_1.User]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "create", null);
__decorate([
    rest_1.Post('/remove', { description: 'Remove a Chat Message', summary: 'Remove Chat' }),
    __param(0, rest_1.BodyParams()),
    __param(1, rest_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [chat_args_1.ChatRemoveArgs,
        user_1.User]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "remove", null);
ChatController = __decorate([
    rest_1.Controller('/chat', { tags: ['Chat'], roles: [enums_1.UserRole.stream] })
], ChatController);
exports.ChatController = ChatController;
//# sourceMappingURL=chat.controller.js.map