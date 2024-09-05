import { getActiveRootPath, parseScssVariables } from "./utils";
import { CACHE, COLOR_PREFIX, SCSS, VARIABLE_PREFIX } from "./constants";
import { ExtensionContext, languages, workspace } from "vscode";
import {
  ColorToVariableProvider,
  VariableProvider,
} from "./providers/scss-provider";
import { configurationWatcher, scssFileWatcher } from "./watcher";

const setup = () => {
  const workspaceFolders = workspace.workspaceFolders || [];
  const firstFolderPath = workspaceFolders[0]?.uri.fsPath;

  CACHE.activeRootPath = getActiveRootPath(firstFolderPath);
  CACHE.variablesList = parseScssVariables();
};

export function activate(context: ExtensionContext) {
  setup();
	configurationWatcher(setup);
  scssFileWatcher(setup);

  const variableProvider = languages.registerCompletionItemProvider(
    SCSS,
    new VariableProvider(),
    COLOR_PREFIX
  );

  const colorToVariableProvider = languages.registerCompletionItemProvider(
    SCSS,
    new ColorToVariableProvider(),
    VARIABLE_PREFIX
  );

  context.subscriptions.push(variableProvider, colorToVariableProvider);
}
