import { CompletionItem, CompletionItemKind, CompletionItemProvider, Position, TextDocument } from "vscode";
import { CACHE, COLOR_PREFIX, VARIABLE_PREFIX } from "../constants";

// 输入颜色提示变量
export class ColorToVariableProvider implements CompletionItemProvider {
    provideCompletionItems(
		document: TextDocument,
		position: Position
	) {
		// const linePrefix = document
		// 	.lineAt(position)
		// 	.text.slice(position.character - 1);
		const variables = CACHE.variablesList;
		const lineText = document.lineAt(position.line).text;

		if (lineText.includes(COLOR_PREFIX)) {
			const colorCompletionItems: CompletionItem[] = [];

			variables.forEach((item) => {
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
export class VariableProvider implements CompletionItemProvider {
	provideCompletionItems(
		document: TextDocument,
		position: Position
	) {
		const variables = CACHE.variablesList;
		const lineText = document.lineAt(position.line).text;

		if (lineText.includes(VARIABLE_PREFIX)) {
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
