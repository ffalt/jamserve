"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrmStringListType = exports.EnumArray = exports.OrmJsonType = void 0;
const mikro_orm_1 = require("mikro-orm");
class OrmJsonType extends mikro_orm_1.Type {
    convertToDatabaseValue(value, _) {
        if (!value) {
            return;
        }
        return JSON.stringify(value);
    }
    convertToJSValue(value, _) {
        if (!value) {
            return;
        }
        if (typeof value === 'string') {
            return JSON.parse(value);
        }
        else {
            return value;
        }
    }
    getColumnType(prop, _) {
        return `text`;
    }
}
exports.OrmJsonType = OrmJsonType;
class EnumArray extends mikro_orm_1.Type {
    convertToDatabaseValue(value) {
        if (value === null)
            return value;
        if (value.length) {
            return `{${value.join(',')}}`;
        }
        throw mikro_orm_1.ValidationError.invalidType(EnumArray, value, 'JS');
    }
    toJSON(value) {
        return value;
    }
    getColumnType() {
        return 'text[]';
    }
}
exports.EnumArray = EnumArray;
class OrmStringListType extends mikro_orm_1.Type {
    convertToDatabaseValue(value, _) {
        if (!value || value.length === 0) {
            return '';
        }
        return `|${value.join('|')}|`;
    }
    convertToJSValue(value, _) {
        if (!value || value.length === 0) {
            return [];
        }
        if (typeof value === 'string') {
            return value.split('|').filter(s => s.length > 0);
        }
        else {
            return value;
        }
    }
    toJSON(value) {
        return value;
    }
    getColumnType(_, __) {
        return 'text';
    }
}
exports.OrmStringListType = OrmStringListType;
//# sourceMappingURL=orm.types.js.map