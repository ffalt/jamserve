var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { InRequestScope } from 'typescript-ioc';
let UserTransformService = class UserTransformService {
    async user(orm, o, userArgs, currentUser) {
        return {
            id: o.id,
            name: o.name,
            created: o.createdAt.valueOf(),
            email: (currentUser?.id === o.id || currentUser?.roleAdmin) ? o.email : undefined,
            roles: {
                admin: o.roleAdmin,
                podcast: o.rolePodcast,
                stream: o.roleStream,
                upload: o.roleUpload
            }
        };
    }
};
UserTransformService = __decorate([
    InRequestScope
], UserTransformService);
export { UserTransformService };
//# sourceMappingURL=user.transform.js.map