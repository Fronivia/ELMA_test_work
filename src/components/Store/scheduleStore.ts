// Функционал прокрутки календаря на неделю
const scheduleStore = {
	currentStep: -4,
	stepLeft() {
		this.currentStep -= 7;
	},
	stepRight() {
		this.currentStep += 7;
	},
};

export default scheduleStore;
