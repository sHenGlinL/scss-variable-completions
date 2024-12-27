import {
  CompletionItem,
  CompletionItemKind,
  CompletionItemProvider,
  Position,
  TextDocument,
  window,
  workspace,
} from "vscode";
import { CACHE, COLOR_PREFIX, CSS_VARIABLE_PREFIX } from "../constants";

type ThemeConfigType = { monorepo: string; theme: string };

// 输入颜色提示变量
export class ColorToCssVariableProvider implements CompletionItemProvider {
  provideCompletionItems(document: TextDocument, position: Position) {
    const lineText = document.lineAt(position.line).text;

    if (lineText.includes(COLOR_PREFIX)) {
      // 获取当前编辑文件的目录路径
      const editor = window.activeTextEditor;
      const filePath = editor?.document.uri.fsPath;
			// 获取当前主题
      const config = workspace.getConfiguration("scss-variable-completions");
      const themeConfig =
        config.get<ThemeConfigType[]>("variableCssTheme") || [];
      const theme = themeConfig.find((item) =>
        filePath?.includes(item.monorepo)
      )?.theme;
			// 根据主题和monorepo获取变量列表
      const variables = CACHE.cssVariablesList.filter(
        (item) =>
          item.theme?.toLowerCase() === theme?.toLowerCase() &&
          filePath?.includes(item.monorepo)
      );
			const variableList = variables.flatMap(item => item.variableList);
			// 搜索
      const colorCompletionItems: CompletionItem[] = [];
      variableList.forEach((item) => {
        const completionItem = new CompletionItem(
          item.color,
          CompletionItemKind.Variable
        );
        completionItem.detail = item.variable;
        completionItem.insertText = `var(${item.variable})`;
        colorCompletionItems.push(completionItem);
      });

      return colorCompletionItems;
    }

    return undefined;
  }
}

// 输入变量提示
export class CssVariableProvider implements CompletionItemProvider {
  provideCompletionItems(document: TextDocument, position: Position) {
    const lineText = document.lineAt(position.line).text;

    if (lineText.includes(CSS_VARIABLE_PREFIX)) {
			// 获取当前编辑文件的目录路径
      const editor = window.activeTextEditor;
      const filePath = editor?.document.uri.fsPath;
			// 获取当前主题
      const config = workspace.getConfiguration("scss-variable-completions");
      const themeConfig =
        config.get<ThemeConfigType[]>("variableCssTheme") || [];
      const theme = themeConfig.find((item) =>
        filePath?.includes(item.monorepo)
      )?.theme;
			// 根据主题和monorepo获取变量列表
      const variables = CACHE.cssVariablesList.filter(
        (item) =>
          item.theme?.toLowerCase() === theme?.toLowerCase() &&
          filePath?.includes(item.monorepo)
      );
			const variableList = variables.flatMap(item => item.variableList);
			// 搜索
      const colorCompletionItems: CompletionItem[] = [];
      variableList.forEach((item) => {
        const completionItem = new CompletionItem(
          item.variable,
          CompletionItemKind.Variable
        );
        completionItem.detail = item.color;
        completionItem.insertText = item.variable;
        colorCompletionItems.push(completionItem);
      });

      return colorCompletionItems;
    }

    return undefined;
  }
}
