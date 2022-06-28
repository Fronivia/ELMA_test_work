import { roundUp } from '@/components/Scheduler/scheduleUtils';
import TaskItem from '@/components/Scheduler/TaskItem';
import observer from '@/components/Store/observer';
import { Feact } from '@/core/Feact/Feact';
import { VNode } from '@/core/Feact/feactTypes';
import htmx from '@/htmx/htmx';
import { IUser } from '@/types/dataTypes';
import '@assets/styles/scheduler.scss';

class Scheduler extends Feact.Component {
	usersList: string[] = ['Идёт', 'Загрузка', 'Данных'];

	private setDate = (_: any, index: number) => {
		const date = new Date();
		date.setDate(date.getDate() + index + this.stores.schedulerStore.currentStep);

		return `${roundUp(date.getDate())}.${roundUp(date.getMonth() + 1)}`;
	};

	private dropHandler(event: DragEvent) {
		// Обрабатываем сброс драгбл элемента
		// Есть 3 кейса, когда сбрасываем в пустую ячейку, ячейку с ником юзера и ячейку с уже имеющей задачи
		event.preventDefault();
		const target = event.target as HTMLDivElement;
		const user = target.closest('[data-username]');
		if (target.getAttribute('data-date') && user) {
			const userName = user.getAttribute('data-username');
			this.stores.dataStore.onDropItem(userName, target.getAttribute('data-date'));
		} else if (target.getAttribute('data-type')) {
			const userName = user!.getAttribute('data-username');
			const date = target.closest('[data-date]')!.getAttribute('data-date');
			this.stores.dataStore.onDropItem(userName, date);
		} else if (target.getAttribute('data-username')) {
			const userName = target.getAttribute('data-username');
			this.stores.dataStore.onDropItem(userName, false);
		}
	}

	private dragoverHandler(event: DragEvent) {
		event.preventDefault();
	}

	// Создаём таблицу (отдельно первую строку и отдельную часть)
	private createTable() {
		// Заметка добавить динамическое число
		const colsCount = 7;
		const rows: any[] = [];
		const cols = new Array(colsCount).fill('').map(this.setDate).map(this.toHeaderColumn);
		rows.push(this.createFirstRow(cols));

		if (this.stores.dataStore.haveData) {
			this.stores.dataStore.userDataForRender.forEach((user: IUser) => {
				const row = new Array(colsCount)
					.fill('')
					.map(this.setDate)
					.map((date) => this.toColumn(date, user));
				rows.push(this.createRow(user.firstName, row));
			});
		} else {
			this.usersList.forEach((user) => {
				const row = new Array(colsCount)
					.fill('')
					.map(this.setDate)
					.map((date) => this.toColumn(date));
				rows.push(this.createRow(user, row));
			});
		}

		return rows;
	}

	private createRow(username: string, cols?: VNode[]) {
		return htmx`
		<div class='scheduler__row' data-username='${username}'>
			<div class='scheduler__col scheduler__col_user-info' data-username='${username}'>${username}</div>
			${cols}
		</div>`;
	}

	private createFirstRow(cols: VNode[]) {
		return htmx`
		<div class='scheduler__row scheduler__row_header'>
			<div class='scheduler__col scheduler__col_header scheduler__col_first-cell'></div>
			${cols}
		</div>
		`;
	}

	private toHeaderColumn(col: string) {
		return htmx`<div class='scheduler__col scheduler__col_header' data-date='${col}'>${col}</div>`;
	}

	private toColumn(col: string, user?: IUser) {
		const taskItem: VNode[] = [];
		if (this.stores.dataStore.haveData && user) {
			const date = user.task;
			date!.forEach((task) => {
				if (col === task.planStartDate) {
					taskItem.push(htmx`<${TaskItem} description='${task.description}' />`);
				}
			});
		}
		return htmx`<div class='scheduler__col' data-date=${col}>${taskItem}</div>`;
	}

	render() {
		return htmx`
			<article 
				class='scheduler' 
				@drop=${this.dropHandler.bind(this)}
				@dragover=${this.dragoverHandler.bind(this)}
			>
				${this.createTable()}
				<div class='scheduler'></div>
			</article>
		`;
	}
}

export default observer(Scheduler, {
	schedulerStore: ['currentStep'],
	dataStore: ['haveData', 'userDataForRender'],
});
