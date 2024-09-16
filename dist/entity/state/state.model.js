var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ObjField, ResultType } from '../../modules/rest/index.js';
import { examples } from '../../modules/engine/rest/example.consts.js';
let State = class State {
};
__decorate([
    ObjField({ nullable: true, description: 'Number of Plays', min: 0, example: 5 }),
    __metadata("design:type", Number)
], State.prototype, "played", void 0);
__decorate([
    ObjField({ nullable: true, description: 'Last Played Timestamp', min: 0, example: examples.timestamp }),
    __metadata("design:type", Number)
], State.prototype, "lastPlayed", void 0);
__decorate([
    ObjField({ nullable: true, description: 'Faved Timestamp', min: 0, example: examples.timestamp }),
    __metadata("design:type", Number)
], State.prototype, "faved", void 0);
__decorate([
    ObjField({ nullable: true, description: 'User Rating', min: 0, max: 5, example: 5 }),
    __metadata("design:type", Number)
], State.prototype, "rated", void 0);
State = __decorate([
    ResultType({ description: 'User State Data' })
], State);
export { State };
let StateInfo = class StateInfo {
};
__decorate([
    ObjField({ description: 'ID', isID: true }),
    __metadata("design:type", String)
], StateInfo.prototype, "id", void 0);
__decorate([
    ObjField(() => State, { description: 'State' }),
    __metadata("design:type", State)
], StateInfo.prototype, "state", void 0);
StateInfo = __decorate([
    ResultType({ description: 'User StateInfo Data' })
], StateInfo);
export { StateInfo };
let States = class States {
};
__decorate([
    ObjField(() => [StateInfo], { description: 'List of State Infos' }),
    __metadata("design:type", Array)
], States.prototype, "states", void 0);
States = __decorate([
    ResultType({ description: 'User States Data' })
], States);
export { States };
//# sourceMappingURL=state.model.js.map