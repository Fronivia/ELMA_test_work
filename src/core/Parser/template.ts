import { IScheme, IState, Mode } from '@/core/Parser/parserTypes';
import streamParams from '@/core/Parser/streamParams/streamParams';
import { streamTemplates } from '@/core/Parser/streamTemplates/streamTemplates';

export default function template(template: TemplateStringsArray, ...params: any[]) {
	const state: IState = {
		template: '',
		scheme: {} as IScheme,
		index: 0,
		mode: Mode.SEARCH,
		openTags: [],
		param: null,
		openParam: '',
		textNode: false,
		spread: false,
		skip: 0,
		openQuote: '',
	};
	// Прогоняем каждую шаблонную строку
	template.forEach((tmp, index) => {
		state.template = tmp;

		if (index - 1 >= 0) {
			streamParams.call(state);
		}
		streamTemplates.call(state);
		state.param = params[index];
		state.index = 0;
	});

	return state.scheme;
}
