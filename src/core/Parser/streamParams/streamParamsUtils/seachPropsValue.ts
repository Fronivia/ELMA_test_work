import { IState, Mode } from '@/core/Parser/parserTypes';

export default function searchPropsValue(this: IState) {
	// Находим значение кастомного пропа и закрываем открытый аттрибут
	const openTag = this.openTags[this.openTags.length - 1];
	openTag.props[this.openParam] = this.param;
	this.openParam = '';
	this.mode = Mode.SEARCH_PROP;
}
