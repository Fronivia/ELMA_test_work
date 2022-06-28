import { IState, Mode, TagSymbol } from '@/core/Parser/parserTypes';
import { isQuote } from '@/core/Parser/parserUtils/conditions';

export default function searchPropValue(this: IState, index: number) {
	const symbol = this.template[index];
	// Первую скобоычку мы пропускам после =
	// Ищем вторую и заносим аттрибут в ноду
	if (this.openQuote) {
		if (symbol !== this.openQuote) {
			return;
		}

		const propValue = this.template.slice(this.index, index);
		const openTags = this.openTags[this.openTags.length - 1];

		openTags.props[this.openParam] = propValue;
		this.openParam = '';
		this.openQuote = '';
		this.mode = Mode.SEARCH_PROP;
		return;
	}
	// Когда встречаем = то заносим имя пропа в стейт и проверяем на наличие кавычек
	if (symbol === TagSymbol.EQUAL) {
		const nextSymbol = this.template[index + 1];

		this.openParam = this.template.slice(this.index, index);

		if (isQuote(nextSymbol)) {
			this.skip = 1;
			this.openQuote = nextSymbol;
			this.index = index + 2;
			return;
		}
	}
	// кейс с аттрибутом в одно слово - disabled
	if (symbol === TagSymbol.SPACE) {
		const propsName = this.template.slice(this.index, index);
		const openTags = this.openTags[this.openTags.length - 1];

		openTags.props[propsName] = true;
		this.mode = Mode.SEARCH_PROP;
	}
}
