var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Arg, Args, Ctx, FieldResolver, ID, Query, Resolver, Root as GQLRoot } from 'type-graphql';
import { StateQL } from '../state/state';
import { DBObjectType } from '../../types/enums';
import { Radio, RadioIndexQL, RadioPageQL, RadioQL } from './radio';
import { RadioIndexArgs, RadiosArgs } from './radio.args';
let RadioResolver = class RadioResolver {
    async radio(id, { orm }) {
        return await orm.Radio.oneOrFailByID(id);
    }
    async radios({ page, filter, order, list, seed }, { orm, user }) {
        if (list) {
            return await orm.Radio.findListFilter(list, seed, filter, order, page, user);
        }
        return await orm.Radio.searchFilter(filter, order, page, user);
    }
    async radioIndex({ filter }, { orm }) {
        return await orm.Radio.indexFilter(filter);
    }
    async state(radio, { orm, user }) {
        return await orm.State.findOrCreate(radio.id, DBObjectType.radio, user.id);
    }
};
__decorate([
    Query(() => RadioQL, { description: 'Get a Radio by Id' }),
    __param(0, Arg('id', () => ID)),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RadioResolver.prototype, "radio", null);
__decorate([
    Query(() => RadioPageQL, { description: 'Search Radios' }),
    __param(0, Args()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RadiosArgs, Object]),
    __metadata("design:returntype", Promise)
], RadioResolver.prototype, "radios", null);
__decorate([
    Query(() => RadioIndexQL, { description: 'Get the Navigation Index for Radios' }),
    __param(0, Args()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RadioIndexArgs, Object]),
    __metadata("design:returntype", Promise)
], RadioResolver.prototype, "radioIndex", null);
__decorate([
    FieldResolver(() => StateQL),
    __param(0, GQLRoot()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Radio, Object]),
    __metadata("design:returntype", Promise)
], RadioResolver.prototype, "state", null);
RadioResolver = __decorate([
    Resolver(RadioQL)
], RadioResolver);
export { RadioResolver };
//# sourceMappingURL=radio.resolver.js.map