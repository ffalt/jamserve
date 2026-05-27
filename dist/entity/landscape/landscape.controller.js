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
import { LandscapeData } from './landscape.model.js';
import { LandscapeParameters } from './landscape.parameters.js';
import { UserRole } from '../../types/enums.js';
import { Controller } from '../../modules/rest/decorators/controller.js';
import { Get } from '../../modules/rest/decorators/get.js';
import { QueryParameters } from '../../modules/rest/decorators/query-parameters.js';
import { RestContext } from '../../modules/rest/decorators/rest-context.js';
let LandscapeController = class LandscapeController {
    async get(parameters, { orm, engine }) {
        return engine.landscape.getLandscape(orm, parameters);
    }
};
__decorate([
    Get(() => LandscapeData, { description: 'Get Music Collection Landscape Data for visualization', summary: 'Get Landscape' }),
    __param(0, QueryParameters()),
    __param(1, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LandscapeParameters, Object]),
    __metadata("design:returntype", Promise)
], LandscapeController.prototype, "get", null);
LandscapeController = __decorate([
    Controller('/landscape', { tags: ['Landscape'], roles: [UserRole.stream] })
], LandscapeController);
export { LandscapeController };
//# sourceMappingURL=landscape.controller.js.map