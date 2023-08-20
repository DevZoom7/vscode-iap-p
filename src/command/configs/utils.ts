import * as v from "vscode";
import { Section } from "./types";

export function getTarget<T>(section: Section, defaultValue: any) {
   const wConfig = v.workspace.getConfiguration();
   const target = wConfig.get<T>(`iap-p.${section}`, defaultValue);
   return target;
}

export function isObject(value: unknown) {
   if (value === null || typeof value !== "object" || Array.isArray(value)) {
      return false;
   }
   return true;
}