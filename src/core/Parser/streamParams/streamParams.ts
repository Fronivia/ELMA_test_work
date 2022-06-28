import { IState, Mode } from '@/core/Parser/parserTypes';
import searchPropsValue from '@/core/Parser/streamParams/streamParamsUtils/seachPropsValue';
import searchCommon from '@/core/Parser/streamParams/streamParamsUtils/searchCommon';
import searchProp from '@/core/Parser/streamParams/streamParamsUtils/searchProp';
import searchTag from '@/core/Parser/streamParams/streamParamsUtils/searchTag';

const paramsMap = {
	[Mode.SEARCH]: searchCommon,
	[Mode.SEARCH_TAG]: searchTag,
	[Mode.SEARCH_PROP]: searchProp,
	[Mode.PROP_VALUE]: searchPropsValue,
	[Mode.SEARCH_CLOSE]: () => 'skip, no keys',
};

export default function streamParams(this: IState) {
	paramsMap[this.mode].call(this);
}
