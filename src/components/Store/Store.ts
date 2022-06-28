// Обертка что бы сделать стор реактивным
const reactive = (obj: { [key: string]: any }) => {
	const subscribers: { [key: string]: Array<() => void> } = {};

	function notify(key: string) {
		if (!subscribers[key] || !subscribers[key].length) {
			return;
		}
		subscribers[key].forEach((handler) => handler());
	}

	function subscribe(key: string, handler: () => void) {
		if (!subscribers[key]) {
			subscribers[key] = [];
		}

		subscribers[key].push(handler);
	}

	function unsubscribe(key: string, handler: () => void) {
		subscribers[key] = subscribers[key].filter((cb) => cb !== handler);
	}

	function createReactive(key: string) {
		let value = obj[key];

		Object.defineProperty(obj, key, {
			get() {
				return value;
			},
			set(newValue) {
				value = newValue;
				notify(key);
			},
		});
	}

	Object.keys(obj).forEach((key) => {
		createReactive(key);
	});

	return {
		data: obj,
		subscribe,
		unsubscribe,
	};
};

export default reactive;
