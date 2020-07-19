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
exports.ChatResolver = void 0;
const type_graphql_1 = require("type-graphql");
const chat_service_1 = require("./chat.service");
const chat_1 = require("./chat");
const typescript_ioc_1 = require("typescript-ioc");
const chat_args_1 = require("./chat.args");
let ChatResolver = class ChatResolver {
    async chats({ since }) {
        return this.chatService.get(since);
    }
};
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", chat_service_1.ChatService)
], ChatResolver.prototype, "chatService", void 0);
__decorate([
    type_graphql_1.Query(() => [chat_1.ChatQL], { description: 'Get Chat Messages' }),
    __param(0, type_graphql_1.Args()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [chat_args_1.ChatFilterArgs]),
    __metadata("design:returntype", Promise)
], ChatResolver.prototype, "chats", null);
ChatResolver = __decorate([
    type_graphql_1.Resolver(chat_1.ChatQL)
], ChatResolver);
exports.ChatResolver = ChatResolver;
//# sourceMappingURL=chat.resolver.js.map