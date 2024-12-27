export const COLOR_PREFIX = '#';
export const SCSS_VARIABLE_PREFIX = '$';
export const CSS_VARIABLE_PREFIX = 'var';
export const SCSS = ['scss'];
export const All_STYLE = ['css', 'scss', 'less'];

export type VariableListType = {
	theme?: string;
	monorepo: string;
	variableList: { color: string; variable: string }[];
};

type CacheType = {
	scssVariablesList: VariableListType[];
	cssVariablesList: VariableListType[];
	activeRootPath: string;
};
export const CACHE: CacheType = {
	scssVariablesList: [],
	cssVariablesList: [],
	activeRootPath: '',
};
