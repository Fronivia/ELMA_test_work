import {
	CUSTOM,
	MODE_CLOSE,
	MODE_PROPS,
	MODE_PROPS_VALUE,
	MODE_TAGNAME,
	MODE_TEXT,
	SPREAD,
} from './constants';

export default function createMap(templates: TemplateStringsArray) {
	let mode = MODE_TEXT;
	let symbol = '';
	let buffer = '';
	let quote = '';
	const map: any[] = [];

	function checkBuffer() {
		buffer = buffer.replace(/^\s*\n\s*|\s*\n\s*$/g, '');
		return Boolean(buffer);
	}

	function commit(value: any, state?: number) {
		if (value) {
			map.push(state ?? mode, value);
			buffer = '';
		}
	}

	for (let i = 0; i < templates.length; i++) {
		mode === MODE_TEXT && checkBuffer() && commit(buffer);

		if (i > 0) {
			mode === MODE_PROPS && buffer === '...' ? commit(CUSTOM, SPREAD) : commit(CUSTOM);
		}

		for (let j = 0; j < templates[i].length; j++) {
			symbol = templates[i][j];

			if (mode === MODE_TEXT) {
				if (symbol === '<') {
					checkBuffer() && commit(buffer);
					mode = MODE_TAGNAME;
				} else {
					buffer += symbol;
				}
			} else if (symbol === '>') {
				commit(buffer);
				mode = MODE_TEXT;
			} else if (mode === MODE_CLOSE) {
				continue;
			} else if (quote) {
				if (symbol === quote) {
					commit(buffer);
					quote = '';
				} else {
					buffer += symbol;
				}
			} else if (symbol === '"' || symbol === "'") { // eslint-disable-line
				quote = symbol;
			} else if (symbol === '=') {
				commit(buffer);
				mode = MODE_PROPS_VALUE;
			} else if (symbol === ' ' || symbol === '\t' || symbol === '\n' || symbol === '\r') {
				commit(buffer);
				mode = MODE_PROPS;
			} else if (symbol === '/') {
				mode === MODE_TAGNAME && commit(buffer);
				mode = MODE_CLOSE;
				commit(true);
			} else {
				buffer += symbol;
			}
		}
	}

	return map;
}
