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
      if (!data) {
        continue;
      }

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
      if (!data) {
        continue;
      }

      let match;
      while ((match = themeRegex.exec(data)) !== null) {
        const theme = match[1]; // 'Dark' 或 'Light'
        const variablesText = match[2]; // 包含变量和颜色的文本

        // 用来存储变量名和颜色值的对象
        const variablesMap: any = {};
        let variableMatch;

        // 从 CSS 中提取所有的变量及其值
        while ((variableMatch = variableRegex.exec(variablesText)) !== null) {
          const variable = variableMatch[1].trim();
          let value = variableMatch[2].trim();

          // 如果值是一个变量引用（比如 var(--palette-gray-50)），将它保存为引用，稍后解析
          variablesMap[variable] = value;
        }

        // 递归解析变量的值，直到没有引用为止
        function resolveVariable(value: string) {
          // 如果值是变量引用（var(--something)），递归解析它
          if (value.startsWith("var(")) {
            const referencedVariable = value
              .match(/var\(--([^\)]+?)(?:,.*)?\)/)?.[1]
              .trim();
            if (referencedVariable && variablesMap[referencedVariable]) {
              return resolveVariable(variablesMap[referencedVariable]); // 递归解析引用
            }
          }
          return value; // 返回最终解析的颜色值
        }

        // 生成目标格式的数组
        variableList.push({
          theme,
          monorepo,
          variableList: Object.keys(variablesMap).map((variable) => ({
            variable: `--${variable}`,
            color: resolveVariable(variablesMap[variable]),
          }))
        });
      }
    }

    return variableList;
  } catch (error) {
    return [];
  }
};
