import { Feact } from '@/core/Feact/Feact';
import htmx from '@/htmx/htmx';

interface IProps {
	description: string;
}

export default class TaskItem extends Feact.Component<IProps> {
	render() {
		return htmx`
			<div class='task-item' data-type='task'>${
				this.props.description ? this.props.description : ' '
			}</div>
		`;
	}
}
