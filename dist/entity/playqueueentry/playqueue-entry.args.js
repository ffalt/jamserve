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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayQueueEntryOrderArgsQL = exports.PlayQueueEntryOrderArgs = void 0;
const decorators_1 = require("../../modules/rest/decorators");
const enums_1 = require("../../types/enums");
const base_args_1 = require("../base/base.args");
const type_graphql_1 = require("type-graphql");
let PlayQueueEntryOrderArgs = class PlayQueueEntryOrderArgs extends base_args_1.OrderByArgs {
};
__decorate([
    decorators_1.ObjField(() => enums_1.PlayQueueEntryOrderFields, { nullable: true, description: 'order by field' }),
    type_graphql_1.Field(() => enums_1.PlayQueueEntryOrderFields, { nullable: true }),
    __metadata("design:type", String)
], PlayQueueEntryOrderArgs.prototype, "orderBy", void 0);
PlayQueueEntryOrderArgs = __decorate([
    type_graphql_1.InputType(),
    decorators_1.ObjParamsType()
], PlayQueueEntryOrderArgs);
exports.PlayQueueEntryOrderArgs = PlayQueueEntryOrderArgs;
let PlayQueueEntryOrderArgsQL = class PlayQueueEntryOrderArgsQL extends PlayQueueEntryOrderArgs {
};
PlayQueueEntryOrderArgsQL = __decorate([
    type_graphql_1.InputType()
], PlayQueueEntryOrderArgsQL);
exports.PlayQueueEntryOrderArgsQL = PlayQueueEntryOrderArgsQL;
//# sourceMappingURL=playqueue-entry.args.js.map