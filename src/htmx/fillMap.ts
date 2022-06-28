// @ts-nocheck
import {
	CUSTOM,
	MODE_CLOSE,
	MODE_PROPS,
	MODE_PROPS_VALUE,
	MODE_TAGNAME,
	MODE_TEXT,
	SPREAD,
} from './constants';

export default function fillMap(map: any[], params: any[]) {
	let index = 0;
	let type = 0;
	const tags = [];

	function checkCustom(value: any) {
		return value === CUSTOM ? params[index++] : value;
	}

	for (let i = 0; i < map.length; i += 2) {
		type = map[i];

		if (type === MODE_TAGNAME) {
			tags.push({ tag: checkCustom(map[i + 1]), props: { children: [] } });
		} else if (type === MODE_PROPS) {
			if (map[i + 2] === MODE_PROPS_VALUE) {
				tags[tags.length - 1].props[checkCustom(map[i + 1])] = checkCustom(map[i + 3]);
				i += 2;
			} else {
				tags[tags.length - 1].props[checkCustom(map[i + 1])] = true;
			}
		} else if (type === MODE_TEXT) {
			const value = checkCustom(map[i + 1]);
			tags[tags.length - 1].props.children.push(...(Array.isArray(value) ? value : [value]));
		} else if (type === MODE_CLOSE) {
			tags.length > 1 && tags[tags.length - 2].props.children.push(tags.pop());
		} else if (type === SPREAD) {
			tags[tags.length - 1].props = Object.assign(
				tags[tags.length - 1].props,
				checkCustom(map[i + 1]),
			);
		}
	}

	return tags[0];
}
