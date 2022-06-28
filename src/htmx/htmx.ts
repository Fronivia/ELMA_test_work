import { VNode } from '@/core/Feact/feactTypes';

import createMap from './createMap';
import fillMap from './fillMap';

const CACHES = new Map();

export default function htmx(templates: TemplateStringsArray, ...params: any[]): VNode {
	let map = CACHES.get(templates);
	!map && CACHES.set(templates, (map = createMap(templates)));
	return fillMap(map, params);
}
