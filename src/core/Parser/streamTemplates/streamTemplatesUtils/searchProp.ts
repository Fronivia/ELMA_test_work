import { IState, Mode, TagSymbol } from '@/core/Parser/parserTypes';
import { isSpread } from '@/core/Parser/parserUtils/conditions';

export default function searchProp(this: IState, index: number) {
	const symbol = this.template[index];

	// prop / > ...
	if (symbol === TagSymbol.CLOSE) {
		this.mode = Mode.SEARCH;
		return;
	}
	// ЗАМЕТКА
	if (symbol === TagSymbol.SLASH) {
		if (this.openTags.length > 1) {
			const parentNode = this.openTags[this.openTags.length - 2];
			const childNode = this.openTags.pop()!;

			// Заметка поправить
			childNode.props['children'] = childNode.children;
			delete childNode.children;
			parentNode.children!.push(childNode);

			return;
		}
		// Удаляем
		if (this.openTags.length) {
			const childNode = this.openTags.pop()!;
			// Заметка поправить
			childNode.props['children'] = childNode.children;
			delete childNode.children;
			this.scheme = childNode;
			return;
		}
	}

	if (symbol === TagSymbol.DOT) {
		const isSprd = isSpread(symbol, this.template[index + 1], this.template[index + 2]);

		if (isSprd) {
			this.skip = 2;
			this.spread = true;
			return;
		}
	}

	// Если нашли букву то начать поток занесения значения пропса
	if (symbol && symbol !== TagSymbol.SPACE) {
		this.index = index;
		this.mode = Mode.PROP_VALUE;
	}
}
