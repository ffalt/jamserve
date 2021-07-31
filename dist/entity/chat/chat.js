var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Field, ID, ObjectType } from 'type-graphql';
let Chat = class Chat {
};
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], Chat.prototype, "message", void 0);
__decorate([
    Field(() => Date),
    __metadata("design:type", Number)
], Chat.prototype, "created", void 0);
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], Chat.prototype, "userName", void 0);
__decorate([
    Field(() => ID),
    __metadata("design:type", String)
], Chat.prototype, "userID", void 0);
Chat = __decorate([
    ObjectType()
], Chat);
export { Chat };
let ChatQL = class ChatQL extends Chat {
};
ChatQL = __decorate([
    ObjectType()
], ChatQL);
export { ChatQL };
//# sourceMappingURL=chat.js.map