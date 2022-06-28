import { IState } from '@/core/Parser/parserTypes';

export default function searchCommon(this: IState) {
	// Когда встречаем ${ } между элементом при поиске <
	const openTag = this.openTags[this.openTags.length - 1];
	// Для работы spread оператора
	const param = Array.isArray(this.param) ? this.param : [this.param];

	openTag.children!.push(...param);
}
