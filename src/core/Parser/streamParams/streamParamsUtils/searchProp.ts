import { IState } from '@/core/Parser/parserTypes';

export default function searchProp(this: IState) {
	// div ${disabled}
	const openTag = this.openTags[this.openTags.length - 1];
	// <div ...${props}
	if (this.spread) {
		openTag.props = {
			...openTag.props,
			...this.param,
		};

		this.spread = false;
		return;
	}
	// props.disabled = true
	openTag.props[this.param] = true;
}
