export interface IObj {
	[key: string]: any;
}

export type Tag = string | { new (...args: any[]): any };

export interface IScheme {
	tag: Tag;
	props: IObj;
	children?: Array<IScheme | string>;
}

export enum Mode {
	SEARCH = 'search',
	SEARCH_TAG = 'searchTag',
	SEARCH_PROP = 'searchProp',
	PROP_VALUE = 'propValue',
	SEARCH_CLOSE = 'searchClose',
}

export interface IState {
	template: string;
	scheme: IScheme;
	index: number;
	mode: Mode;
	openTags: IScheme[];
	param: any;
	textNode: boolean;
	openParam: string;
	openQuote: string;
	spread: boolean;
	skip: number;
}

export enum TagSymbol {
	OPEN = '<',
	SLASH = '/',
	CLOSE = '>',
	SPACE = ' ',
	EQUAL = '=',
	DOT = '.',
}
