var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { PlayQueueEntryOrderFields } from '../../types/enums.js';
import { OrderByParameters } from '../base/base.parameters.js';
import { Field, InputType } from 'type-graphql';
import { ObjectParametersType } from '../../modules/rest/decorators/object-parameters-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';
let PlayQueueEntryOrderParameters = class PlayQueueEntryOrderParameters extends OrderByParameters {
};
__decorate([
    ObjectField(() => PlayQueueEntryOrderFields, { nullable: true, description: 'order by field' }),
    Field(() => PlayQueueEntryOrderFields, { nullable: true }),
    __metadata("design:type", String)
], PlayQueueEntryOrderParameters.prototype, "orderBy", void 0);
PlayQueueEntryOrderParameters = __decorate([
    InputType(),
    ObjectParametersType()
], PlayQueueEntryOrderParameters);
export { PlayQueueEntryOrderParameters };
let PlayQueueEntryOrderParametersQL = class PlayQueueEntryOrderParametersQL extends PlayQueueEntryOrderParameters {
};
PlayQueueEntryOrderParametersQL = __decorate([
    InputType()
], PlayQueueEntryOrderParametersQL);
export { PlayQueueEntryOrderParametersQL };
//# sourceMappingURL=playqueue-entry.parameters.js.map