import { ExcludedMessage } from "./types";
import { isObject } from "./utils";

export function validateAlwaysOverwrite(value: unknown, defaultValue: boolean) {
   if (typeof value !== "boolean") {
      return defaultValue;
   }
   return value;
}

export function validateTabSize(value: unknown, defaultValue: number) {
   if (value === null || value === undefined || typeof value !== "number") {
      return defaultValue;
   }
   if (value < 0) {
      return defaultValue;
   }
   if (value > 10) {
      return 10;
   }
   return value;
}

export function validateFileConfigs(
   value: unknown,
   defaultValue: Map<string, Record<string, any>>
) {
   if (!isObject(value)) {
      return defaultValue;
   }
   const obj = value as object;
   const entries = Object.entries(obj);
   const map = new Map(entries);
   entries.forEach((entry) => {
      const [key, value] = entry;
      if (!isObject(value)) {
         map.delete(key);
      }
   });
   return map;
}
