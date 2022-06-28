// Полученные данные с сервера о задачах + информация об исполнителе
export interface ITask {
	id: string;
	executor?: number;
	subject: string;
	description: string;
	creationAuthor: number;
	creationDate: string;
	endDate: string;
	order: number;
	planEndDate: string;
	planStartDate: string;
	status: number;
	creator?: string; // Имя исполнителя если он есть
}

export type Tasks = ITask[];

// Информация с сервера об пользователе + информация о задачах
export interface IUser {
	firstName: string;
	secondName: string;
	surname: string;
	username: string;
	id: number;
	task?: IExecutorTask[]; // Если есть задачи, занести сюда
}

interface IExecutorTask {
	description: string;
	planEndDate: string;
	planStartDate: string;
	endDate: string;
}

export type Users = IUser[];

export interface IAsideState {
	haveData: boolean;
	userDataForRender: Users;
	dataForBacklog: Tasks;
	dataForRenderBacklog: Tasks;
	getData: () => void;
	onDropItem: (username: string, date: string | false) => void;
	draggableItem: null | ITask;
}
