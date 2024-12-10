import { CompletionItem, CompletionItemKind, CompletionItemProvider, Position, TextDocument } from "vscode";
import { CACHE, COLOR_PREFIX, CSS_VARIABLE_PREFIX } from "../constants";

// 输入颜色提示变量
export class ColorToCssVariableProvider implements CompletionItemProvider {
    provideCompletionItems(
		document: TextDocument,
		position: Position
	) {
		const variables = CACHE.cssVariablesList;
		const lineText = document.lineAt(position.line).text;

		if (lineText.includes(COLOR_PREFIX)) {
			const colorCompletionItems: CompletionItem[] = [];

			variables.forEach((item) => {
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
	provideCompletionItems(
		document: TextDocument,
		position: Position
	) {
		const variables = CACHE.cssVariablesList;
		const lineText = document.lineAt(position.line).text;

		if (lineText.includes(CSS_VARIABLE_PREFIX)) {
			const colorCompletionItems: CompletionItem[] = [];

			variables.forEach((item) => {
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
