import { ExtensionContext } from "vscode";
import command from "./command";

export function activate(context: ExtensionContext) {
	context.subscriptions.push(command)
}