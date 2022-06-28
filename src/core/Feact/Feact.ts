import { Children, CustomHTMLElement, IState, Props, Tag, VNode } from '@/core/Feact/feactTypes';
import {
	FeactInstanceMap,
	FeactReconciler,
	getTopLevelComponentInContainer,
	renderNewRootComponent,
	updateRootComponent,
} from '@/core/Feact/utils/feactUtils';

export const Feact = {
	// создаем схему
	createElement(tag: Tag, props: Props | null, children?: Children): VNode {
		const element = {
			tag,
			props: props || {},
		};

		if (children) {
			element.props.children = children;
		}

		return element;
	},

	Component: class<T = {}> {
		public props: T;
		public state: any;
		public stores: any;
		// инициализируем пропсы и сощлаем стейт
		constructor(props: T) {
			this.props = props;
			this.state = this.state ?? this.getInitialState();
		}

		private getInitialState() {
			return {};
		}

		// получает новый стейт, получает инстанс, записывает туда новый стейт?
		public setState(partialState: IState) {
			const internalInstance = FeactInstanceMap.get(this);
			internalInstance.pendingPartialState = partialState;
			FeactReconciler.performUpdateIfNecessary(internalInstance);
		}

		// обновить насильно компонент
		public forceUpdate() {
			const internalInstance = FeactInstanceMap.get(this);
			FeactReconciler.forceUpdate(internalInstance);
		}
	},

	render(element: VNode, container: CustomHTMLElement) {
		const prevComponent = getTopLevelComponentInContainer(container);

		if (prevComponent) {
			return updateRootComponent(prevComponent, element);
		}

		return renderNewRootComponent(element, container);
	},
};
