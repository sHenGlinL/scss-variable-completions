import { workspace } from "vscode";

export const scssFileWatcher = (callback: () => void) => {
  const scssFileChange = workspace.createFileSystemWatcher(
    "**/*.scss",
    true,
    false,
    true
  );

  scssFileChange.onDidCreate(callback);
  scssFileChange.onDidChange(callback);
  scssFileChange.onDidDelete(callback);
};

export const configurationWatcher = (callback: () => void) => {
  workspace.onDidChangeConfiguration((e) => {
    if (e.affectsConfiguration("scss-variable-completions.variableScssPaths")) {
      callback();
    }
  });
};
