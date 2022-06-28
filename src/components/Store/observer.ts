import stores from '@/components/Store/stores';
import { IComponent, Props } from '@/core/Feact/feactTypes';

// Обёртка что бы компоненты реагировали на его изменения
export default function observer(
	target: { new (props: any): IComponent },
	deps: { [key: string]: string[] },
) {
	return class extends target {
		private storeDeps: any[] = [];
		public stores: {
			[key: string]: any;
		} = {};

		constructor(props: Props) {
			super(props);
			Object.keys(deps).forEach((storeName) => {
				deps[storeName].forEach((field) => {
					const updateFc = this.forceUpdate.bind(this);
					stores[storeName].subscribe(field, updateFc);
					this.storeDeps.push(stores[storeName].unsubscribe.bind(null, field, updateFc));
				});

				this.stores[storeName] = stores[storeName].data;
			});
		}

		override __clearStoreDeps() {
			this.storeDeps.forEach((handler) => handler());
		}
	};
}
