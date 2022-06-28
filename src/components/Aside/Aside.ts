import search from '@assets/icons/search.svg';
import ListItem from '@/components/Aside/ListItem';
import observer from '@/components/Store/observer';
import { Feact } from '@/core/Feact/Feact';
import htmx from '@/htmx/htmx';
import { ITask } from '@/types/dataTypes';
import '@assets/styles/aside.scss';


class Aside extends Feact.Component {
	private inputHandler(event: InputEvent) {
		const value = (event.target as HTMLInputElement).value.toLowerCase();
		if (!this.stores.dataStore.haveData) return;
		const sortedArr = this.stores.dataStore.dataForBacklog!.filter(
			(task: ITask) =>
				task.subject.toLowerCase().includes(value) ||
				task.creator?.toLowerCase().includes(value),
		);
		this.stores.dataStore.dataForRenderBacklog = sortedArr;
	}
	// Рендерим список тасков в беклоге
	private renderListItem() {
		const renderList = this.stores.dataStore.dataForRenderBacklog.map(
			(task: ITask) => htmx`<${ListItem} task='${task}' />`,
		);
		return renderList;
	}

	render() {
		const renderData = this.stores.dataStore.haveData
			? this.renderListItem()
			: 'Идет загрузка данных';
		return htmx`
			<aside class='aside'>
				<h1 class='aside__title'>BackLog</h1>
				<form class='aside__form'>
					<input class='aside__input' @input='${this.inputHandler.bind(this)}' type='text' id='search'/>
					<label class='aside__label' for='search'><img class='form__img' src='${search}' alt=''/></label>
				</form>
				<ul class='task-list'>
					${renderData}
				</ul>				
			</aside>
		`;
	}
}

export default observer(Aside, {
	dataStore: ['haveData', 'dataForBacklog', 'dataForRenderBacklog', 'userDataForRender'],
});
