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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WaveformResolver = void 0;
const type_graphql_1 = require("type-graphql");
const waveform_1 = require("./waveform");
const builder_1 = require("../../modules/rest/builder");
let WaveformResolver = class WaveformResolver {
    async waveform(id, { orm }) {
        const result = await orm.findInWaveformTypes(id);
        if (!result) {
            return Promise.reject(builder_1.NotFoundError());
        }
        return result;
    }
    async json(waveform, { engine }) {
        return JSON.stringify(await engine.waveform.getWaveformJSON(waveform.obj, waveform.objType));
    }
    async svg(waveform, width, { engine }) {
        return (await engine.waveform.getWaveformSVG(waveform.obj, waveform.objType, width)) || '';
    }
};
__decorate([
    type_graphql_1.Query(() => waveform_1.WaveformQL),
    __param(0, type_graphql_1.Arg('id', () => type_graphql_1.ID)),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], WaveformResolver.prototype, "waveform", null);
__decorate([
    type_graphql_1.FieldResolver(() => String),
    __param(0, type_graphql_1.Root()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [waveform_1.Waveform, Object]),
    __metadata("design:returntype", Promise)
], WaveformResolver.prototype, "json", null);
__decorate([
    type_graphql_1.FieldResolver(() => String),
    __param(0, type_graphql_1.Root()), __param(1, type_graphql_1.Arg('width', () => type_graphql_1.Int)), __param(2, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [waveform_1.Waveform, Number, Object]),
    __metadata("design:returntype", Promise)
], WaveformResolver.prototype, "svg", null);
WaveformResolver = __decorate([
    type_graphql_1.Resolver(waveform_1.WaveformQL)
], WaveformResolver);
exports.WaveformResolver = WaveformResolver;
//# sourceMappingURL=waveform.resolver.js.map