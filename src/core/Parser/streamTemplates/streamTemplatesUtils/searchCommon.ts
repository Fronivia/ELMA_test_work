import { IState, Mode, TagSymbol } from '@/core/Parser/parserTypes';
import { isSpecialSymbol } from '@/core/Parser/parserUtils/conditions';

export default function searchCommon(this: IState, index: number) {
	const symbol = this.template[index];
	// проверка на <
	if (symbol === TagSymbol.OPEN) {
		// проверка на текстовый узел, если да то закинуть как текст
		if (this.textNode) {
			const openTag = this.openTags[this.openTags.length - 1];

			const text = this.template
				.slice(this.index, index)
				.split('')
				.filter((sb) => !isSpecialSymbol(sb))
				.join('');

			openTag.children!.push(text);
			this.textNode = false;
		}

		// Проверяем закрывается ли тег, если да то закрываем его
		if (this.template[index + 1] === TagSymbol.SLASH) {
			this.mode = Mode.SEARCH_CLOSE;
			return;
		}
		// Сохраняем индекс, ищем тег
		this.index = index + 1;
		this.mode = Mode.SEARCH_TAG;
		return;
	}
	// Если встретили буковки(текстовый узел)
	if (!this.textNode && symbol !== TagSymbol.CLOSE) {
		this.index = index;
		this.textNode = true;
	}
}
