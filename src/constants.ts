export const COLOR_PREFIX = '#';
export const SCSS_VARIABLE_PREFIX = '$';
export const CSS_VARIABLE_PREFIX = 'var';
export const SCSS = ['scss'];
export const All_STYLE = ['css', 'scss', 'less'];

type CacheType = {
	scssVariablesList: { color: string; variable: string }[];
	cssVariablesList: { color: string; variable: string }[];
	activeRootPath: string;
};
export const CACHE: CacheType = {
	scssVariablesList: [],
	cssVariablesList: [],
	activeRootPath: '',
};
