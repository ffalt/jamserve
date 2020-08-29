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
exports.ChatFilterArgs = exports.ChatRemoveArgs = exports.ChatCreateArgs = void 0;
const decorators_1 = require("../../modules/rest/decorators");
const example_consts_1 = require("../../modules/engine/rest/example.consts");
const type_graphql_1 = require("type-graphql");
let ChatCreateArgs = class ChatCreateArgs {
};
__decorate([
    decorators_1.ObjField({ description: 'Chat message', example: 'Hello' }),
    __metadata("design:type", String)
], ChatCreateArgs.prototype, "message", void 0);
ChatCreateArgs = __decorate([
    decorators_1.ObjParamsType()
], ChatCreateArgs);
exports.ChatCreateArgs = ChatCreateArgs;
let ChatRemoveArgs = class ChatRemoveArgs {
};
__decorate([
    decorators_1.ObjField({ description: 'Chat time', example: example_consts_1.examples.timestamp }),
    __metadata("design:type", Number)
], ChatRemoveArgs.prototype, "time", void 0);
ChatRemoveArgs = __decorate([
    decorators_1.ObjParamsType()
], ChatRemoveArgs);
exports.ChatRemoveArgs = ChatRemoveArgs;
let ChatFilterArgs = class ChatFilterArgs {
};
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Float, { nullable: true }),
    decorators_1.ObjField(() => Number, { nullable: true, description: 'filter by message timestamp', min: 0, example: example_consts_1.examples.timestamp }),
    __metadata("design:type", Number)
], ChatFilterArgs.prototype, "since", void 0);
ChatFilterArgs = __decorate([
    type_graphql_1.ArgsType(),
    decorators_1.ObjParamsType()
], ChatFilterArgs);
exports.ChatFilterArgs = ChatFilterArgs;
//# sourceMappingURL=chat.args.js.map