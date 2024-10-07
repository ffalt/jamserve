var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { examples } from '../../modules/engine/rest/example.consts.js';
import { ArgsType, Field, Int } from 'type-graphql';
import { ObjParamsType } from '../../modules/rest/decorators/ObjParamsType.js';
import { ObjField } from '../../modules/rest/decorators/ObjField.js';
let ChatCreateArgs = class ChatCreateArgs {
};
__decorate([
    ObjField({ description: 'Chat message', example: 'Hello' }),
    __metadata("design:type", String)
], ChatCreateArgs.prototype, "message", void 0);
ChatCreateArgs = __decorate([
    ObjParamsType()
], ChatCreateArgs);
export { ChatCreateArgs };
let ChatRemoveArgs = class ChatRemoveArgs {
};
__decorate([
    ObjField({ description: 'Chat time', example: examples.timestamp }),
    __metadata("design:type", Number)
], ChatRemoveArgs.prototype, "time", void 0);
ChatRemoveArgs = __decorate([
    ObjParamsType()
], ChatRemoveArgs);
export { ChatRemoveArgs };
let ChatFilterArgs = class ChatFilterArgs {
};
__decorate([
    Field(() => Int, { nullable: true }),
    ObjField({ nullable: true, description: 'filter by message timestamp', min: 0, example: examples.timestamp }),
    __metadata("design:type", Number)
], ChatFilterArgs.prototype, "since", void 0);
ChatFilterArgs = __decorate([
    ArgsType(),
    ObjParamsType()
], ChatFilterArgs);
export { ChatFilterArgs };
//# sourceMappingURL=chat.args.js.map