import observer from '@/components/Store/observer';
import { Feact } from '@/core/Feact/Feact';
import htmx from '@/htmx/htmx';
import { ITask } from '@/types/dataTypes';

class ListItem extends Feact.Component<{ task: ITask }> {
	private dragStartHandler() {
		this.stores.dataStore.draggableItem = this.props.task;
	}

	private dragEndHandler() {
		this.stores.dataStore.draggableItem = null;
	}

	render() {
		const { subject, creator } = this.props.task;
		return htmx`
			<li class='task-list__item' draggable @dragstart='${this.dragStartHandler.bind(
				this,
			)}' @dragend='${this.dragEndHandler.bind(this)}'>
				<span class='task-list__username'>${creator}</span>
				<span class='task-list__task'>${subject}</span>
			</li>
		`;
	}
}

export default observer(ListItem, {
	dataStore: [],
});
