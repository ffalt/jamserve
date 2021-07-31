var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { InRequestScope } from 'typescript-ioc';
import { parseAgent } from './session.utils';
let SessionTransformService = class SessionTransformService {
    userSession(orm, o) {
        const ua = parseAgent(o);
        return {
            id: o.id,
            client: o.client,
            expires: o.expires ? o.expires.valueOf() : undefined,
            mode: o.mode,
            platform: ua?.platform,
            os: ua?.os,
            agent: o.agent
        };
    }
};
SessionTransformService = __decorate([
    InRequestScope
], SessionTransformService);
export { SessionTransformService };
//# sourceMappingURL=session.transform.js.map