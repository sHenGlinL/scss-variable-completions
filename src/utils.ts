import { window, workspace } from "vscode";
import * as fs from "fs";
import * as path from "path";
import { CACHE } from "./constants";

export const getActiveRootPath = (firstFolderPath = CACHE.activeRootPath) => {
  if (window.activeTextEditor) {
    return (
      workspace.getWorkspaceFolder(window.activeTextEditor.document.uri)?.uri
        .fsPath || firstFolderPath
    );
  }
  return firstFolderPath;
};

// 读取并解析 SCSS 变量文件
export const parseScssVariables = () => {
  // 获取当前工作目录
  const rootPath = getActiveRootPath();
  //  获取配置
  const config = workspace.getConfiguration("scss-variable-completions");
  const relativePaths = config.get<string[]>("variableScssPaths") || [""];
  // 生成scss文件的绝对路径
  const filePaths = relativePaths.map((relativePath) =>
    path.join(rootPath, relativePath)
  );
  // 遍历解析scss文件
  const variableList: { color: string; variable: string }[] = [];

  for (let filePath of filePaths) {
    const data = fs.readFileSync(filePath, "utf-8");
    const regex = /\$([\w-]+):\s*(#[0-9a-fA-F]+);/g;
    let match;
    while ((match = regex.exec(data)) !== null) {
      variableList.push({
        color: match[2],
        variable: `$${match[1]}`,
      });
    }
  }

  return variableList;
};
