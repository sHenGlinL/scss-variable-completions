import { workspace } from "vscode";

export const variableFileWatcher = (callback: () => void) => {
  const fileChange = workspace.createFileSystemWatcher(
    "**/*.{css,scss}",
    true,
    false,
    true
  );

  fileChange.onDidCreate(callback);
  fileChange.onDidChange(callback);
  fileChange.onDidDelete(callback);
};

export const configurationWatcher = (callback: () => void) => {
  workspace.onDidChangeConfiguration((e) => {
    if (e.affectsConfiguration("scss-variable-completions.variableScssPaths")) {
      callback();
    }
    if (e.affectsConfiguration("scss-variable-completions.variableCssPaths") || e.affectsConfiguration("scss-variable-completions.variableCssTheme")) {
      callback();
    }
  });
};
