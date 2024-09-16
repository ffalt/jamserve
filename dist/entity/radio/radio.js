var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Field, ObjectType } from 'type-graphql';
import { Entity, Property } from '../../modules/orm/index.js';
import { Base, Index, IndexGroup, PaginatedResponse } from '../base/base.js';
import { State, StateQL } from '../state/state.js';
let Radio = class Radio extends Base {
    constructor() {
        super(...arguments);
        this.disabled = false;
    }
};
__decorate([
    Field(() => String),
    Property(() => String),
    __metadata("design:type", String)
], Radio.prototype, "name", void 0);
__decorate([
    Field(() => String),
    Property(() => String),
    __metadata("design:type", String)
], Radio.prototype, "url", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Radio.prototype, "homepage", void 0);
__decorate([
    Field(() => Boolean),
    Property(() => Boolean),
    __metadata("design:type", Boolean)
], Radio.prototype, "disabled", void 0);
Radio = __decorate([
    ObjectType(),
    Entity()
], Radio);
export { Radio };
let RadioQL = class RadioQL extends Radio {
};
__decorate([
    Field(() => StateQL),
    __metadata("design:type", State)
], RadioQL.prototype, "state", void 0);
RadioQL = __decorate([
    ObjectType()
], RadioQL);
export { RadioQL };
let RadioPageQL = class RadioPageQL extends PaginatedResponse(Radio, RadioQL) {
};
RadioPageQL = __decorate([
    ObjectType()
], RadioPageQL);
export { RadioPageQL };
let RadioIndexGroupQL = class RadioIndexGroupQL extends IndexGroup(Radio, RadioQL) {
};
RadioIndexGroupQL = __decorate([
    ObjectType()
], RadioIndexGroupQL);
export { RadioIndexGroupQL };
let RadioIndexQL = class RadioIndexQL extends Index(RadioIndexGroupQL) {
};
RadioIndexQL = __decorate([
    ObjectType()
], RadioIndexQL);
export { RadioIndexQL };
//# sourceMappingURL=radio.js.map