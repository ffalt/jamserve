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
import { ObjectParametersType } from '../../modules/rest/decorators/object-parameters-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';
let ChatCreateParameters = class ChatCreateParameters {
};
__decorate([
    ObjectField({ description: 'Chat message', example: 'Hello' }),
    __metadata("design:type", String)
], ChatCreateParameters.prototype, "message", void 0);
ChatCreateParameters = __decorate([
    ObjectParametersType()
], ChatCreateParameters);
export { ChatCreateParameters };
let ChatRemoveParameters = class ChatRemoveParameters {
};
__decorate([
    ObjectField({ description: 'Chat time', example: examples.timestamp }),
    __metadata("design:type", Number)
], ChatRemoveParameters.prototype, "time", void 0);
ChatRemoveParameters = __decorate([
    ObjectParametersType()
], ChatRemoveParameters);
export { ChatRemoveParameters };
let ChatFilterParameters = class ChatFilterParameters {
};
__decorate([
    Field(() => Int, { nullable: true }),
    ObjectField({ nullable: true, description: 'filter by message timestamp', min: 0, example: examples.timestamp }),
    __metadata("design:type", Number)
], ChatFilterParameters.prototype, "since", void 0);
ChatFilterParameters = __decorate([
    ArgsType(),
    ObjectParametersType()
], ChatFilterParameters);
export { ChatFilterParameters };
//# sourceMappingURL=chat.parameters.js.map