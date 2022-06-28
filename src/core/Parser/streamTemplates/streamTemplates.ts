import { IState, Mode } from '@/core/Parser/parserTypes';
import { isSpecialSymbol } from '@/core/Parser/parserUtils/conditions';
import searchClose from '@/core/Parser/streamTemplates/streamTemplatesUtils/searchClose';
import searchCommon from '@/core/Parser/streamTemplates/streamTemplatesUtils/searchCommon';
import searchProp from '@/core/Parser/streamTemplates/streamTemplatesUtils/searchProp';
import searchPropValue from '@/core/Parser/streamTemplates/streamTemplatesUtils/searchPropValue';
import searchTag from '@/core/Parser/streamTemplates/streamTemplatesUtils/searchTag';

const templateMap = {
	[Mode.SEARCH]: searchCommon,
	[Mode.SEARCH_TAG]: searchTag,
	[Mode.SEARCH_PROP]: searchProp,
	[Mode.PROP_VALUE]: searchPropValue,
	[Mode.SEARCH_CLOSE]: searchClose,
};

export function streamTemplates(this: IState) {
	for (let i = 0; i < this.template.length; i++) {
		if (this.skip) {
			--this.skip;
			continue;
		}

		if (isSpecialSymbol(this.template[i])) {
			continue;
		}

		templateMap[this.mode].call(this, i);
	}
}
