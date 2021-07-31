var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ObjField, ObjParamsType } from '../../modules/rest/decorators';
import { PlayQueueEntryOrderFields } from '../../types/enums';
import { OrderByArgs } from '../base/base.args';
import { Field, InputType } from 'type-graphql';
let PlayQueueEntryOrderArgs = class PlayQueueEntryOrderArgs extends OrderByArgs {
};
__decorate([
    ObjField(() => PlayQueueEntryOrderFields, { nullable: true, description: 'order by field' }),
    Field(() => PlayQueueEntryOrderFields, { nullable: true }),
    __metadata("design:type", String)
], PlayQueueEntryOrderArgs.prototype, "orderBy", void 0);
PlayQueueEntryOrderArgs = __decorate([
    InputType(),
    ObjParamsType()
], PlayQueueEntryOrderArgs);
export { PlayQueueEntryOrderArgs };
let PlayQueueEntryOrderArgsQL = class PlayQueueEntryOrderArgsQL extends PlayQueueEntryOrderArgs {
};
PlayQueueEntryOrderArgsQL = __decorate([
    InputType()
], PlayQueueEntryOrderArgsQL);
export { PlayQueueEntryOrderArgsQL };
//# sourceMappingURL=playqueue-entry.args.js.map