import { Props } from '@/core/Feact/feactTypes';

// Обертка что бы обрабатывать и состовной компонент, и строку

export default class TopLevelWrapper {
	public props;
	constructor(props: Props) {
		this.props = props;
	}

	render() {
		return this.props;
	}
}
