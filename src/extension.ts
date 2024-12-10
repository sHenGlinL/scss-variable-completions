import { ExtensionContext, languages, workspace } from "vscode";
import { getActiveRootPath, parseCssVariables, parseScssVariables } from "./utils";
import { All_STYLE, CACHE, COLOR_PREFIX, CSS_VARIABLE_PREFIX, SCSS, SCSS_VARIABLE_PREFIX } from "./constants";
import { ColorToScssVariableProvider, ScssVariableProvider } from "./providers/scss-provider";
import { ColorToCssVariableProvider, CssVariableProvider } from "./providers/css-provider";
import { configurationWatcher, variableFileWatcher } from "./watcher";

const setup = () => {
  const workspaceFolders = workspace.workspaceFolders || [];
  const firstFolderPath = workspaceFolders[0]?.uri.fsPath;

  CACHE.activeRootPath = getActiveRootPath(firstFolderPath);
  CACHE.scssVariablesList = parseScssVariables();
  CACHE.cssVariablesList = parseCssVariables();
};

export function activate(context: ExtensionContext) {
  setup();
  
	configurationWatcher(setup);
  variableFileWatcher(setup);

  // scss变量提醒
  const scssVariableProvider = languages.registerCompletionItemProvider(
    SCSS,
    new ScssVariableProvider(),
    SCSS_VARIABLE_PREFIX
  );
  const colorToScssVariableProvider = languages.registerCompletionItemProvider(
    SCSS,
    new ColorToScssVariableProvider(),
    COLOR_PREFIX
  );

  // css变量提醒
  const cssVariableProvider = languages.registerCompletionItemProvider(
    All_STYLE,
    new CssVariableProvider(),
    CSS_VARIABLE_PREFIX
  );
  const colorToCssVariableProvider = languages.registerCompletionItemProvider(
    All_STYLE,
    new ColorToCssVariableProvider(),
    COLOR_PREFIX
  );

  context.subscriptions.push(scssVariableProvider, colorToScssVariableProvider, cssVariableProvider, colorToCssVariableProvider);
}
