import { ClassMetadata } from "./class-metadata";

export interface ResultClassMetadata extends ClassMetadata {
  interfaceClasses: Function[] | undefined;
}
