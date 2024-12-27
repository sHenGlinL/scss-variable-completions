import { window, workspace } from "vscode";
import * as fs from "fs";
import * as path from "path";
import { CACHE, VariableListType } from "./constants";

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
  try {
    // 获取当前工作目录
    const rootPath = getActiveRootPath();
    //  获取配置
    const config = workspace.getConfiguration("scss-variable-completions");
    const relativePaths =
      config.get<{ monorepo: string; path: string }[]>("variableScssPaths") ||
      [];
    // 生成scss文件的绝对路径
    const filePaths = relativePaths.map((item) => ({
      ...item,
      path: path.join(rootPath, item.path),
    }));
    // 遍历解析scss文件
    const variableList: VariableListType[] = [];

    for (let { monorepo, path } of filePaths) {
      let data;
      try {
        data = fs.readFileSync(path, "utf-8");
      } catch (error) {
        console.error("目录不存在");
      }
      if (!data) {continue;}

      const regex = /\$([\w-]+):\s*(#[0-9a-fA-F]+);/g;
      let match;
      let variables = [];
      while ((match = regex.exec(data)) !== null) {
        variables.push({
          color: match[2],
          variable: `$${match[1]}`,
        });
      }

      variableList.push({ monorepo, variableList: variables });
    }

    return variableList;
  } catch (error) {
    return [];
  }
};

// 读取并解析 CSS 变量文件
export const parseCssVariables = () => {
  try {
    // 获取当前工作目录
    const rootPath = getActiveRootPath();
    //  获取配置
    const config = workspace.getConfiguration("scss-variable-completions");
    const relativePaths =
      config.get<{ monorepo: string; path: string }[]>("variableCssPaths") ||
      [];
    // 生成css文件的绝对路径
    const filePaths = relativePaths.map((item) => ({
      ...item,
      path: path.join(rootPath, item.path),
    }));
    // 遍历解析css文件
    const themeRegex = /\[data-theme='(.*?)'\]\s*\{(.*?)\}/gs;
    const variableRegex = /--([^:]+):\s*([^;]+);/g;
    const variableList: VariableListType[] = [];

    for (let { monorepo, path } of filePaths) {
      let data;
      try {
        data = fs.readFileSync(path, "utf-8");
      } catch (error) {
        console.error("目录不存在");
      }
      if (!data) {continue;}

      let match;
      while ((match = themeRegex.exec(data)) !== null) {
        const theme = match[1]; // 'Dark' 或 'Light'
        const variablesText = match[2]; // 包含变量和颜色的文本

        let variables = [];
        let variableMatch;

        while ((variableMatch = variableRegex.exec(variablesText)) !== null) {
          const variable = `--${variableMatch[1].trim()}`; // 变量名
          let color = variableMatch[2].trim(); // 颜色值
          // 如果颜色值是 var 函数，取其回退值（第二个值）
          if (color.startsWith("var(")) {
            const fallbackMatch = color.match(/,([^)]+)\)/);
            if (fallbackMatch) {
              color = fallbackMatch[1].trim();
            }
          }
          variables.push({ variable, color });
        }

        variableList.push({
          theme,
          monorepo,
          variableList: variables,
        });
      }
    }

    return variableList;
  } catch (error) {
    return [];
  }
};
