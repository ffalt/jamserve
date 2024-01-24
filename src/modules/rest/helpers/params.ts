import { findType } from "./findType";
import { ReturnTypeFunc, TypeOptions, ValidateOptions } from "../definitions/types";
import {CommonArgMetadata} from '../definitions/param-metadata';
import {SymbolKeysNotSupportedError} from 'type-graphql';

export interface ParamInfo {
  prototype: object;
  propertyKey: string | symbol;
  parameterIndex: number;
  argName?: string;
  returnTypeFunc?: ReturnTypeFunc;
  options?: TypeOptions & ValidateOptions;
}
export function getParamInfo({
  prototype,
  propertyKey,
  parameterIndex,
  returnTypeFunc,
  options = {},
}: ParamInfo): CommonArgMetadata {
  if (typeof propertyKey === "symbol" || propertyKey === undefined) {
    throw new SymbolKeysNotSupportedError();
  }

  const { getType, typeOptions } = findType({
    metadataKey: "design:paramtypes",
    prototype,
    propertyKey: propertyKey as string,
    parameterIndex,
    returnTypeFunc,
    typeOptions: options,
  });

  return {
    target: prototype.constructor,
    methodName: propertyKey,
    index: parameterIndex,
    getType,
    typeOptions,
    validate: options.validate,
  };
}
