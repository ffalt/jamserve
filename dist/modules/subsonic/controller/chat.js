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
import { SubsonicRoute } from '../decorators/SubsonicRoute.js';
import { SubsonicParams } from '../decorators/SubsonicParams.js';
import { SubsonicParameterChatMessage, SubsonicParameterChatMessages } from '../model/subsonic-rest-params.js';
import { SubsonicOKResponse, SubsonicResponseChatMessages } from '../model/subsonic-rest-data.js';
import { SubsonicController } from '../decorators/SubsonicController.js';
import { SubsonicCtx } from '../decorators/SubsonicContext.js';
import { SubsonicFormatter } from '../formatter.js';
let SubsonicChatApi = class SubsonicChatApi {
    async addChatMessage(query, { engine, user }) {
        await engine.chat.add(query.message, user);
        return {};
    }
    async getChatMessages(query, { engine }) {
        const messages = await engine.chat.get(query.since);
        return { chatMessages: { chatMessage: messages.map(msg => SubsonicFormatter.packChatMessage(msg)) } };
    }
};
__decorate([
    SubsonicRoute('/addChatMessage', () => SubsonicOKResponse, {
        summary: 'Add Chat Messages',
        description: 'Adds a message to the chat log.',
        tags: ['Chat']
    }),
    __param(0, SubsonicParams()),
    __param(1, SubsonicCtx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SubsonicParameterChatMessage, Object]),
    __metadata("design:returntype", Promise)
], SubsonicChatApi.prototype, "addChatMessage", null);
__decorate([
    SubsonicRoute('/getChatMessages', () => SubsonicResponseChatMessages, {
        summary: 'Get Chat Messages',
        description: 'Returns the current visible (non-expired) chat messages.',
        tags: ['Chat']
    }),
    __param(0, SubsonicParams()),
    __param(1, SubsonicCtx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SubsonicParameterChatMessages, Object]),
    __metadata("design:returntype", Promise)
], SubsonicChatApi.prototype, "getChatMessages", null);
SubsonicChatApi = __decorate([
    SubsonicController()
], SubsonicChatApi);
export { SubsonicChatApi };
//# sourceMappingURL=chat.js.map