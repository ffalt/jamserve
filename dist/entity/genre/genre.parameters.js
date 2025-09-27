var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ArgsType, Field, ID, InputType, Int } from 'type-graphql';
import { examples } from '../../modules/engine/rest/example.consts.js';
import { GenreOrderFields, ListType } from '../../types/enums.js';
import { FilterParameters, OrderByParameters, PaginatedFilterParameters } from '../base/base.parameters.js';
import { ObjectParametersType } from '../../modules/rest/decorators/object-parameters-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';
let IncludesGenreParameters = class IncludesGenreParameters {
};
__decorate([
    ObjectField({ nullable: true, description: 'include state (fav,rate) on genre(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesGenreParameters.prototype, "genreState", void 0);
IncludesGenreParameters = __decorate([
    ObjectParametersType()
], IncludesGenreParameters);
export { IncludesGenreParameters };
let GenreFilterParameters = class GenreFilterParameters {
};
__decorate([
    Field(() => String, { nullable: true }),
    ObjectField({ nullable: true, description: 'filter by Search Query', example: 'pink' }),
    __metadata("design:type", String)
], GenreFilterParameters.prototype, "query", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    ObjectField({ nullable: true, description: 'filter by Genre Name', example: 'Pop' }),
    __metadata("design:type", String)
], GenreFilterParameters.prototype, "name", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by Genre Ids', isID: true }),
    __metadata("design:type", Array)
], GenreFilterParameters.prototype, "ids", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by Track Ids', isID: true }),
    __metadata("design:type", Array)
], GenreFilterParameters.prototype, "trackIDs", void 0);
__decorate([
    Field(() => Int, { nullable: true }),
    ObjectField({ nullable: true, description: 'filter by Creation timestamp', min: 0, example: examples.timestamp }),
    __metadata("design:type", Number)
], GenreFilterParameters.prototype, "since", void 0);
GenreFilterParameters = __decorate([
    InputType(),
    ObjectParametersType()
], GenreFilterParameters);
export { GenreFilterParameters };
let GenreFilterParametersQL = class GenreFilterParametersQL extends GenreFilterParameters {
};
GenreFilterParametersQL = __decorate([
    InputType()
], GenreFilterParametersQL);
export { GenreFilterParametersQL };
let GenreOrderParameters = class GenreOrderParameters extends OrderByParameters {
};
__decorate([
    Field(() => GenreOrderFields, { nullable: true }),
    ObjectField(() => GenreOrderFields, { nullable: true, description: 'order by field' }),
    __metadata("design:type", String)
], GenreOrderParameters.prototype, "orderBy", void 0);
GenreOrderParameters = __decorate([
    InputType(),
    ObjectParametersType()
], GenreOrderParameters);
export { GenreOrderParameters };
let GenreOrderParametersQL = class GenreOrderParametersQL extends GenreOrderParameters {
};
GenreOrderParametersQL = __decorate([
    InputType()
], GenreOrderParametersQL);
export { GenreOrderParametersQL };
let GenreIndexParametersQL = class GenreIndexParametersQL extends FilterParameters(GenreFilterParametersQL) {
};
GenreIndexParametersQL = __decorate([
    ArgsType()
], GenreIndexParametersQL);
export { GenreIndexParametersQL };
let GenrePageParametersQL = class GenrePageParametersQL extends PaginatedFilterParameters(GenreFilterParametersQL, GenreOrderParametersQL) {
};
GenrePageParametersQL = __decorate([
    ArgsType()
], GenrePageParametersQL);
export { GenrePageParametersQL };
let GenresParametersQL = class GenresParametersQL extends GenrePageParametersQL {
};
__decorate([
    Field(() => ListType, { nullable: true }),
    __metadata("design:type", String)
], GenresParametersQL.prototype, "list", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], GenresParametersQL.prototype, "seed", void 0);
GenresParametersQL = __decorate([
    ArgsType()
], GenresParametersQL);
export { GenresParametersQL };
//# sourceMappingURL=genre.parameters.js.map