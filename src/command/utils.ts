import { existsSync, writeFileSync } from "fs";
import { join } from "path";
import * as v from "vscode";
import { Option } from "./types";

export async function chooseConfig(
   fileConfigs: Map<string, any>,
   names: string[]
) {
   return new Promise<any>((res) => {
      const qp = v.window.createQuickPick();
      qp.title = "Choose a configuration";
      qp.items = names.map((n) => ({ label: n }));
      qp.show();
      qp.onDidAccept(() => {
         qp.dispose();
      });
      qp.onDidHide(() => {
         const configName = qp.selectedItems[0].label;
         const chosenConfig = fileConfigs.get(configName);
         res(chosenConfig);
      });
   });
}

export async function createFile(
   chosenConfig: any,
   tabSize: number,
   alwaysOverwrite: boolean
) {
   const folders = v.workspace.workspaceFolders;
   if (!folders) {
      v.window.showInformationMessage("Please create/open a folder first.");
      return;
   }
   let folder: v.WorkspaceFolder;
   if (folders.length === 1) {
      folder = folders[0];
   } else {
      folder = await chooseFolder(folders);
   }
   const folderPath = folder.uri.fsPath;
   const fileName = ".prettierrc";
   const filePath = join(folderPath, fileName);
   const content = JSON.stringify(chosenConfig, null, tabSize);
   const writeFile = () => writeFileSync(filePath, content);
   if (!existsSync(filePath)) {
      writeFile();
   } else if (existsSync(filePath) && alwaysOverwrite) {
      writeFile();
   } else {
      const options = new Set([
         "open",
         "overwrite",
         "always overwrite",
      ] as const);
      const editor = v.window.activeTextEditor;
      if (editor) {
         const path = editor.document.uri.fsPath;
         if (path === filePath) {
            options.delete("open");
         }
      }
      const userChoice = await chooseOption<Option>(Array.from(options));
      switch (userChoice) {
         case "open": {
            const textDocument = await v.workspace.openTextDocument(filePath);
            await v.window.showTextDocument(textDocument.uri);
            break;
         }
         case "overwrite": {
            writeFile();
            break;
         }
         case "always overwrite": {
            writeFile();
            v.workspace
               .getConfiguration()
               .update(
                  "iap-p.alwaysOverwrite",
                  true,
                  v.ConfigurationTarget.Global
               );
            break;
         }
      }
   }
}

async function chooseOption<T extends string>(options: T[]): Promise<T> {
   return new Promise((res) => {
      const qp = v.window.createQuickPick();
      qp.title = "File already exists • Choose an action";
      qp.items = options.map((o) => ({ label: o }));
      qp.show();
      qp.onDidAccept(() => {
         qp.dispose();
      });
      qp.onDidHide(() => {
         const pickedOption = qp.selectedItems[0].label;
         res(pickedOption as T);
      });
   });
}

async function chooseFolder(folders: readonly v.WorkspaceFolder[]) {
   const names = folders.map((f) => f.name);
   return new Promise<v.WorkspaceFolder>((res) => {
      const qp = v.window.createQuickPick();
      qp.title = "Choose a folder to create the file in";
      qp.items = names.map((n) => ({ label: n }));
      qp.show();
      qp.onDidAccept(() => {
         qp.dispose();
      });
      qp.onDidHide(() => {
         const folderName = qp.selectedItems[0].label;
         const chosenFolder = folders.find(
            (folder) => folder.name === folderName
         )!;
         res(chosenFolder);
      });
   });
}
