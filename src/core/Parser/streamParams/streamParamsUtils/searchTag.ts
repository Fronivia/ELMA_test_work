import { IState, Mode } from '@/core/Parser/parserTypes';
import element from '@/core/Parser/parserUtils/element';

export default function searchTag(this: IState) {
	// кейс <${CustomTag} />
	const node = element(this.param);
	this.openTags.push(node);
	this.mode = Mode.SEARCH_PROP;
}
