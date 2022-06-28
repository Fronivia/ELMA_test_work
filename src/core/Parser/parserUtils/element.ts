import { IScheme } from '@/core/Parser/parserTypes';

export default function element(name: string): IScheme {
	return {
		tag: name,
		props: {},
		children: [],
	};
}
