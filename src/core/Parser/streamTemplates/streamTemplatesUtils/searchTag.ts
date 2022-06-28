import { IState, Mode, TagSymbol } from '@/core/Parser/parserTypes';
import element from '@/core/Parser/parserUtils/element';

export default function searchTag(this: IState, index: number) {
	const symbol = this.template[index];
	// Если видим пробел, то сохраняем тег как открытый и начинаем поиск пропсов
	if (symbol === TagSymbol.SPACE) {
		const tagName = this.template.slice(this.index, index);
		const node = element(tagName);
		this.openTags.push(node);
		this.mode = Mode.SEARCH_PROP;
		return;
	}
	// Если видим >, то сохраняем тег как открытый и начинаем поиск нового элемента
	if (symbol === TagSymbol.CLOSE) {
		const tagName = this.template.slice(this.index, index);
		const node = element(tagName);
		this.openTags.push(node);
		this.mode = Mode.SEARCH;
		return;
	}
	// Если видим /, то сохраняем тег в схеме или как ребенка родителя
	if (symbol === TagSymbol.SLASH) {
		const tagName = this.template.slice(this.index, index);
		const node = element(tagName);

		// Заметка поправить
		node.props['children'] = node.children;
		delete node.children;

		if (this.openTags.length >= 1) {
			const parentNode = this.openTags[this.openTags.length - 1];

			parentNode.children!.push(node);
			this.mode = Mode.SEARCH;
			return;
		}

		this.scheme = node;
		this.mode = Mode.SEARCH;
	}
}
