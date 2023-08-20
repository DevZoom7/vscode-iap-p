import {validateAlwaysOverwrite, validateFileConfigs, validateTabSize} from "./validation";
import { getTarget } from "./utils";


function getTabSize() {
   const defaultValue = 2;
   const tabSize = getTarget<number>("tabSize", defaultValue);
   const validTabSize = validateTabSize(tabSize, defaultValue);
   return validTabSize;
}

function getAlwaysOverwrite() {
   const defaultValue = false;
   const alwaysOverwrite = getTarget<boolean>("alwaysOverwrite", defaultValue);
   const validAlwaysOverwrite = validateAlwaysOverwrite(alwaysOverwrite, defaultValue);
   return validAlwaysOverwrite;
}

function getFileConfigs() {
   const defaultValue = new Map();
   const fileConfigs = getTarget("configs", defaultValue);
   const validFileConfigs = validateFileConfigs(fileConfigs, defaultValue);
   return validFileConfigs;
}

export default function getConfigs() {
   return {
      tabSize: getTabSize(),
      alwaysOverwrite: getAlwaysOverwrite(),
      fileConfigs: getFileConfigs(),
   };
}