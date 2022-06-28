export function isSpecialSymbol(symbol: string) {
	return +symbol === 0 ? symbol !== ' ' : false;
}

export function isQuote(symbol: string) {
	const QUOTE_1 = '"';
	// ts_ignore
	const QUOTE_2 = "'"; // eslint-disable-line

	return symbol === QUOTE_1 || symbol === QUOTE_2;
}

export function isSpread(sb1: string, sb2: string, sb3: string) {
	const DOT = '.';

	return sb1 === DOT && sb2 === DOT && sb3 === DOT;
}
