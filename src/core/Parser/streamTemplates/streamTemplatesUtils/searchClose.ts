import { IState, Mode, TagSymbol } from '@/core/Parser/parserTypes';

export default function searchClose(this: IState, index: number) {
	const symbol = this.template[index];
	// Если символ >, то меняем тип поиска и заносим в схему
	if (symbol === TagSymbol.CLOSE) {
		this.mode = Mode.SEARCH;

		if (this.openTags.length > 1) {
			const parentNode = this.openTags[this.openTags.length - 2];
			const childNode = this.openTags.pop()!;
			// Заметка поправить
			childNode.props['children'] = childNode.children;
			delete childNode.children;
			parentNode.children!.push(childNode);
			return;
		}

		if (this.openTags.length) {
			const childNode = this.openTags.pop()!;
			// Заметка поправить
			childNode.props['children'] = childNode.children;
			delete childNode.children;
			this.scheme = childNode;
		}
	}
}

// import { IState, Mode, TagSymbol } from '@/core/Parser/parserTypes';
//
// export default function searchClose(this: IState, index: number) {
// 	const symbol = this.template[index];
// 	// Если символ >, то меняем тип поиска и заносим в схему
// 	if (symbol === TagSymbol.CLOSE) {
// 		this.mode = Mode.SEARCH;
//
// 		if (this.openTags.length > 1) {
// 			const parentNode = this.openTags[this.openTags.length - 2];
// 			const childNode = this.openTags.pop()!;
//
// 			parentNode.children.push(childNode);
// 			return;
// 		}
//
// 		if (this.openTags.length) {
// 			this.scheme = this.openTags.pop()!;
// 		}
// 	}
// }
