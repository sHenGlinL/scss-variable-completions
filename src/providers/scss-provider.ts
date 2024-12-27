import {
  CompletionItem,
  CompletionItemKind,
  CompletionItemProvider,
  Position,
  TextDocument,
  window,
  workspace,
} from "vscode";
import { CACHE, COLOR_PREFIX, SCSS_VARIABLE_PREFIX } from "../constants";

// 输入颜色提示变量
export class ColorToScssVariableProvider implements CompletionItemProvider {
  provideCompletionItems(document: TextDocument, position: Position) {
    const lineText = document.lineAt(position.line).text;

    if (lineText.includes(COLOR_PREFIX)) {
			// 获取当前编辑文件的目录路径
      const editor = window.activeTextEditor;
      const filePath = editor?.document.uri.fsPath;
      // 根据monorepo获取变量列表
      const variables = CACHE.scssVariablesList.filter((item) =>
        filePath?.includes(item.monorepo)
      );
      const variableList = variables.flatMap((item) => item.variableList);
			// 搜索
      const colorCompletionItems: CompletionItem[] = [];
      variableList.forEach((item) => {
        const completionItem = new CompletionItem(
          item.color,
          CompletionItemKind.Variable
        );
        completionItem.detail = item.variable;
        completionItem.insertText = item.variable;
        colorCompletionItems.push(completionItem);
      });

      return colorCompletionItems;
    }

    return undefined;
  }
}

// 输入变量提示
export class ScssVariableProvider implements CompletionItemProvider {
  provideCompletionItems(document: TextDocument, position: Position) {
    const lineText = document.lineAt(position.line).text;

    if (lineText.includes(SCSS_VARIABLE_PREFIX)) {
      // 获取当前编辑文件的目录路径
      const editor = window.activeTextEditor;
      const filePath = editor?.document.uri.fsPath;
      // 根据monorepo获取变量列表
      const variables = CACHE.scssVariablesList.filter((item) =>
        filePath?.includes(item.monorepo)
      );
      const variableList = variables.flatMap((item) => item.variableList);
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
