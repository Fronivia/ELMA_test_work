import { createDate } from '@/components/Scheduler/scheduleUtils';
import { IAsideState, ITask, Tasks, Users } from '@/types/dataTypes';

const dataStore: IAsideState = {
	haveData: false,
	userDataForRender: [],
	dataForBacklog: [],
	dataForRenderBacklog: [],
	draggableItem: null,
	onDropItem(userName: string, date: string | false) {
		// Проверяет есть ли драгбл айтем
		if (!this.draggableItem) {
			return;
		}
		// Убираем задачу из списка беклога и добавляем её пользователю
		this.dataForBacklog = this.dataForBacklog.filter(
			(task) => task.id !== this.draggableItem!.id,
		);
		this.dataForRenderBacklog = this.dataForRenderBacklog.filter(
			(task) => task.id !== this.draggableItem!.id,
		);
		const currentUser = this.userDataForRender.find((user) => user.firstName === userName);
		const currentUserIndex = this.userDataForRender.findIndex(
			(user) => user.firstName === userName,
		);
		const newTask = sortData(this.draggableItem, date);
		currentUser!.task?.push(newTask);
		this.userDataForRender[currentUserIndex] = currentUser!;
		this.userDataForRender = this.userDataForRender; // eslint-disable-line
	},
	async getData() {
		// Получаем данные об пользователях и задачах
		const tasks: Tasks = await getTasks();
		const users: Users = await getUsers();
		const dataForUsers: Users = [];
		const dataForBacklog: Tasks = [];
		// Немного редактируем данные для удобной работы
		tasks.forEach((task) => {
			// Если есть исполнитель, то заносим в стартовый рендер
			if (task.executor) {
				const currentExecutor = users.find((user) => user.id === task.executor);
				// Заносим задачу и исполнителя в одну коллекцию данных и проверяем не повторяется ли исполнитель
				if (currentExecutor!.task) {
					currentExecutor!.task.push(sortData(task, false));
				} else {
					currentExecutor!.task = [];
					currentExecutor!.task.push(sortData(task, false));
					dataForUsers.push(currentExecutor!);
				}
				// если исполнителя нет то заносим задачу в беклог
			} else {
				users.find((user) => {
					if (user.id === task.creationAuthor) {
						task.creator = user.firstName;
						dataForBacklog.push(task);
						return true;
					}

					return false;
				});
			}
		});
		// Меняем глобальный стор
		this.userDataForRender = dataForUsers;
		this.dataForBacklog = dataForBacklog;
		this.dataForRenderBacklog = dataForBacklog;
		this.haveData = true;
	},
};

export default dataStore;

async function getUsers() {
	const response = await fetch(
		'https://varankin_dev.elma365.ru/api/extensions/2a38760e-083a-4dd0-aebc-78b570bfd3c7/script/users',
	);
	if (response.ok) {
		const data = await response.json();
		return data;
	}
	return false;
}

async function getTasks() {
	const response = await fetch(
		'https://varankin_dev.elma365.ru/api/extensions/2a38760e-083a-4dd0-aebc-78b570bfd3c7/script/tasks',
	);
	if (response.ok) {
		const data = await response.json();
		return data;
	}
	return false;
}

// Меняем данные для удобной работы (реформатируем дату и добавляем задачу)
function sortData(task: ITask, date: string | false) {
	return {
		description: task.subject,
		planEndDate: createDate(task.planEndDate),
		planStartDate: date || createDate(task.planStartDate),
		endDate: createDate(task.endDate),
	};
}
