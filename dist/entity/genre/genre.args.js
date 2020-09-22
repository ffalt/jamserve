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
exports.GenresArgsQL = exports.GenrePageArgsQL = exports.GenreIndexArgsQL = exports.GenreOrderArgsQL = exports.GenreOrderArgs = exports.GenreFilterArgsQL = exports.GenreFilterArgs = exports.IncludesGenreArgs = void 0;
const decorators_1 = require("../../modules/rest/decorators");
const type_graphql_1 = require("type-graphql");
const example_consts_1 = require("../../modules/engine/rest/example.consts");
const enums_1 = require("../../types/enums");
const base_args_1 = require("../base/base.args");
let IncludesGenreArgs = class IncludesGenreArgs {
};
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'include state (fav,rate) on genre(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesGenreArgs.prototype, "genreState", void 0);
IncludesGenreArgs = __decorate([
    decorators_1.ObjParamsType()
], IncludesGenreArgs);
exports.IncludesGenreArgs = IncludesGenreArgs;
let GenreFilterArgs = class GenreFilterArgs {
};
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    decorators_1.ObjField({ nullable: true, description: 'filter by Search Query', example: 'pink' }),
    __metadata("design:type", String)
], GenreFilterArgs.prototype, "query", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    decorators_1.ObjField({ nullable: true, description: 'filter by Genre Name', example: 'Pop' }),
    __metadata("design:type", String)
], GenreFilterArgs.prototype, "name", void 0);
__decorate([
    type_graphql_1.Field(() => [type_graphql_1.ID], { nullable: true }),
    decorators_1.ObjField(() => [String], { nullable: true, description: 'filter by Genre Ids', isID: true }),
    __metadata("design:type", Array)
], GenreFilterArgs.prototype, "ids", void 0);
__decorate([
    type_graphql_1.Field(() => [type_graphql_1.ID], { nullable: true }),
    decorators_1.ObjField(() => [String], { nullable: true, description: 'filter by Track Ids', isID: true }),
    __metadata("design:type", Array)
], GenreFilterArgs.prototype, "trackIDs", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Float, { nullable: true }),
    decorators_1.ObjField({ nullable: true, description: 'filter by Creation timestamp', min: 0, example: example_consts_1.examples.timestamp }),
    __metadata("design:type", Number)
], GenreFilterArgs.prototype, "since", void 0);
GenreFilterArgs = __decorate([
    type_graphql_1.InputType(),
    decorators_1.ObjParamsType()
], GenreFilterArgs);
exports.GenreFilterArgs = GenreFilterArgs;
let GenreFilterArgsQL = class GenreFilterArgsQL extends GenreFilterArgs {
};
GenreFilterArgsQL = __decorate([
    type_graphql_1.InputType()
], GenreFilterArgsQL);
exports.GenreFilterArgsQL = GenreFilterArgsQL;
let GenreOrderArgs = class GenreOrderArgs extends base_args_1.OrderByArgs {
};
__decorate([
    type_graphql_1.Field(() => enums_1.GenreOrderFields, { nullable: true }),
    decorators_1.ObjField(() => enums_1.GenreOrderFields, { nullable: true, description: 'order by field' }),
    __metadata("design:type", String)
], GenreOrderArgs.prototype, "orderBy", void 0);
GenreOrderArgs = __decorate([
    type_graphql_1.InputType(),
    decorators_1.ObjParamsType()
], GenreOrderArgs);
exports.GenreOrderArgs = GenreOrderArgs;
let GenreOrderArgsQL = class GenreOrderArgsQL extends GenreOrderArgs {
};
GenreOrderArgsQL = __decorate([
    type_graphql_1.InputType()
], GenreOrderArgsQL);
exports.GenreOrderArgsQL = GenreOrderArgsQL;
let GenreIndexArgsQL = class GenreIndexArgsQL extends base_args_1.FilterArgs(GenreFilterArgsQL) {
};
GenreIndexArgsQL = __decorate([
    type_graphql_1.ArgsType()
], GenreIndexArgsQL);
exports.GenreIndexArgsQL = GenreIndexArgsQL;
let GenrePageArgsQL = class GenrePageArgsQL extends base_args_1.PaginatedFilterArgs(GenreFilterArgsQL, GenreOrderArgsQL) {
};
GenrePageArgsQL = __decorate([
    type_graphql_1.ArgsType()
], GenrePageArgsQL);
exports.GenrePageArgsQL = GenrePageArgsQL;
let GenresArgsQL = class GenresArgsQL extends GenrePageArgsQL {
};
__decorate([
    type_graphql_1.Field(() => enums_1.ListType, { nullable: true }),
    __metadata("design:type", String)
], GenresArgsQL.prototype, "list", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], GenresArgsQL.prototype, "seed", void 0);
GenresArgsQL = __decorate([
    type_graphql_1.ArgsType()
], GenresArgsQL);
exports.GenresArgsQL = GenresArgsQL;
//# sourceMappingURL=genre.args.js.map