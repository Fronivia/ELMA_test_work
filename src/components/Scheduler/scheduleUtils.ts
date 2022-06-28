// округляем дату, что бы из 5.12 получилось 05.12
export function roundUp(value: number): string {
	return value < 10 ? `0${value}` : `${value}`;
}

export function createDate(date: string): string {
	// 2022-06-27
	const newDate = new Date(date);

	return `${roundUp(newDate.getDate())}.${roundUp(newDate.getMonth() + 1)}`;
}
