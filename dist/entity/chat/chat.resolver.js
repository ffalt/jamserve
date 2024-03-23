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
import { Root as GQLRoot, Args, Ctx, FieldResolver, Query, Resolver } from 'type-graphql';
import { ChatQL } from './chat';
import { ChatFilterArgs } from './chat.args';
let ChatResolver = class ChatResolver {
    async chats({ since }, { engine }) {
        return engine.chat.get(since);
    }
    created(timestamp) {
        return new Date(timestamp);
    }
};
__decorate([
    Query(() => [ChatQL], { description: 'Get Chat Messages' }),
    __param(0, Args()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ChatFilterArgs, Object]),
    __metadata("design:returntype", Promise)
], ChatResolver.prototype, "chats", null);
__decorate([
    FieldResolver(() => Date),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Date)
], ChatResolver.prototype, "created", null);
ChatResolver = __decorate([
    Resolver(ChatQL)
], ChatResolver);
export { ChatResolver };
//# sourceMappingURL=chat.resolver.js.map