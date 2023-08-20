import * as v from "vscode";
import getConfigs from "./configs";
import { chooseConfig, createFile } from "./utils";

const command = v.commands.registerCommand("iap-p.create", commandHandler);

async function commandHandler() {
   const { alwaysOverwrite, fileConfigs, tabSize } = getConfigs();
   if (fileConfigs.size < 1) {
      v.window.showInformationMessage(
         "Please create some configurations to use."
      );
      return;
   }
   const names = Array.from(fileConfigs.keys());
   let chosenConfig: any;
   if (fileConfigs.size === 1) {
      chosenConfig = fileConfigs.get(names[0]);
   } else {
      chosenConfig = await chooseConfig(fileConfigs, names);
   }
   await createFile(chosenConfig, tabSize, alwaysOverwrite);
}

export default command;
