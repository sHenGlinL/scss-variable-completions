export const COLOR_PREFIX = '#';
export const VARIABLE_PREFIX = '$';
export const SCSS = ['scss'];

type CacheType = {
	variablesList: { color: string; variable: string }[];
	activeRootPath: string;
};
export const CACHE: CacheType = {
	variablesList: [],
	activeRootPath: '',
};
