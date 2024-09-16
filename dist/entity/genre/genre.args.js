var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ObjField, ObjParamsType } from '../../modules/rest/index.js';
import { ArgsType, Field, Float, ID, InputType } from 'type-graphql';
import { examples } from '../../modules/engine/rest/example.consts.js';
import { GenreOrderFields, ListType } from '../../types/enums.js';
import { FilterArgs, OrderByArgs, PaginatedFilterArgs } from '../base/base.args.js';
let IncludesGenreArgs = class IncludesGenreArgs {
};
__decorate([
    ObjField({ nullable: true, description: 'include state (fav,rate) on genre(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesGenreArgs.prototype, "genreState", void 0);
IncludesGenreArgs = __decorate([
    ObjParamsType()
], IncludesGenreArgs);
export { IncludesGenreArgs };
let GenreFilterArgs = class GenreFilterArgs {
};
__decorate([
    Field(() => String, { nullable: true }),
    ObjField({ nullable: true, description: 'filter by Search Query', example: 'pink' }),
    __metadata("design:type", String)
], GenreFilterArgs.prototype, "query", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    ObjField({ nullable: true, description: 'filter by Genre Name', example: 'Pop' }),
    __metadata("design:type", String)
], GenreFilterArgs.prototype, "name", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by Genre Ids', isID: true }),
    __metadata("design:type", Array)
], GenreFilterArgs.prototype, "ids", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by Track Ids', isID: true }),
    __metadata("design:type", Array)
], GenreFilterArgs.prototype, "trackIDs", void 0);
__decorate([
    Field(() => Float, { nullable: true }),
    ObjField({ nullable: true, description: 'filter by Creation timestamp', min: 0, example: examples.timestamp }),
    __metadata("design:type", Number)
], GenreFilterArgs.prototype, "since", void 0);
GenreFilterArgs = __decorate([
    InputType(),
    ObjParamsType()
], GenreFilterArgs);
export { GenreFilterArgs };
let GenreFilterArgsQL = class GenreFilterArgsQL extends GenreFilterArgs {
};
GenreFilterArgsQL = __decorate([
    InputType()
], GenreFilterArgsQL);
export { GenreFilterArgsQL };
let GenreOrderArgs = class GenreOrderArgs extends OrderByArgs {
};
__decorate([
    Field(() => GenreOrderFields, { nullable: true }),
    ObjField(() => GenreOrderFields, { nullable: true, description: 'order by field' }),
    __metadata("design:type", String)
], GenreOrderArgs.prototype, "orderBy", void 0);
GenreOrderArgs = __decorate([
    InputType(),
    ObjParamsType()
], GenreOrderArgs);
export { GenreOrderArgs };
let GenreOrderArgsQL = class GenreOrderArgsQL extends GenreOrderArgs {
};
GenreOrderArgsQL = __decorate([
    InputType()
], GenreOrderArgsQL);
export { GenreOrderArgsQL };
let GenreIndexArgsQL = class GenreIndexArgsQL extends FilterArgs(GenreFilterArgsQL) {
};
GenreIndexArgsQL = __decorate([
    ArgsType()
], GenreIndexArgsQL);
export { GenreIndexArgsQL };
let GenrePageArgsQL = class GenrePageArgsQL extends PaginatedFilterArgs(GenreFilterArgsQL, GenreOrderArgsQL) {
};
GenrePageArgsQL = __decorate([
    ArgsType()
], GenrePageArgsQL);
export { GenrePageArgsQL };
let GenresArgsQL = class GenresArgsQL extends GenrePageArgsQL {
};
__decorate([
    Field(() => ListType, { nullable: true }),
    __metadata("design:type", String)
], GenresArgsQL.prototype, "list", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], GenresArgsQL.prototype, "seed", void 0);
GenresArgsQL = __decorate([
    ArgsType()
], GenresArgsQL);
export { GenresArgsQL };
//# sourceMappingURL=genre.args.js.map