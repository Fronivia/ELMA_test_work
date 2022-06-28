import FeactDomComponent from '@/core/Feact/FeactDomComponent';
import {
	CustomHTMLElement,
	IComponent,
	ICompositeComponent,
	IState,
	Props,
	VNode,
} from '@/core/Feact/feactTypes';
import {
	FeactInstanceMap,
	FeactReconciler,
	instantiateFeactComponent,
} from '@/core/Feact/utils/feactUtils';

type NodesForRepalce = {
	parent: CustomHTMLElement;
	child: CustomHTMLElement;
};

function findNodesForRepalce(
	renderedComponent: FeactCompositeWrapper | FeactDomComponent,
): NodesForRepalce {
	if ((renderedComponent as FeactDomComponent).hostNode) {
		return {
			parent: (renderedComponent as FeactDomComponent).hostNode.parentElement!,
			child: (renderedComponent as FeactDomComponent).hostNode,
		};
	}

	return findNodesForRepalce((renderedComponent as FeactCompositeWrapper).renderedComponent);
}

export default class FeactCompositeWrapper {
	private currentElement;
	private instance: IComponent;
	public renderedComponent: FeactCompositeWrapper | FeactDomComponent;
	public pendingPartialState: IState | null;

	// Принимаем виртуал ноду
	constructor(element: VNode) {
		this.currentElement = element;
	}

	// вызываем рендер у инстанса
	performInitialMount(container: CustomHTMLElement) {
		const renderedElement = this.instance.render();
		// В зависимости от того, что он вернул оборачиваем в составную обертку или рендерим элемент
		const child = instantiateFeactComponent(renderedElement);

		this.renderedComponent = child;

		return FeactReconciler.mountComponent(child, container);
	}

	performReplace() {
		const renderedElement = this.instance.render();
		const child = instantiateFeactComponent(renderedElement);
		if (!this.renderedComponent) {
			this.renderedComponent = child;
		} else {
			this.renderedComponent.unMount(false);
			this.renderedComponent = child;
		}
		return FeactReconciler.replaceComponent(child);
	}

	// Если получили не строку, а составной компонент
	receiveComponent(nextElement: VNode) {
		const prevElement = this.currentElement;
		this.updateComponent(prevElement, nextElement);
	}

	// Обновляем компонент
	updateComponent(prevElement: VNode, nextElement: VNode) {
		const nextProps = nextElement.props;
		const inst = this.instance;

		let shouldUpdate = true;
		// Меняем всегда стейт при получении новых данных
		const nextState = { ...inst.state, ...this.pendingPartialState };
		this.pendingPartialState = null;
		// Если при повторном рендере не совпадают теги
		if (prevElement.tag !== nextElement.tag) {
			// Возвращает родителя в котором лежал текущий компонент и текущая нода в родителе
			const { parent, child } = findNodesForRepalce(this.renderedComponent);

			this.currentElement = nextElement;
			// Возвращает новую ноду
			const newNode = FeactReconciler.replaceComponent(this);

			this.instance.componentWillMount?.();
			// Заменяем на нового ребенка
			parent.replaceChild(newNode, child);

			this.instance.componentDidMount?.();

			inst.props = nextProps;
			inst.state = nextState;
			return;
		}
		if (inst.shouldComponentUpdate) {
			shouldUpdate = inst.shouldComponentUpdate(nextProps, nextState);
		}

		if (shouldUpdate) {
			this.performComponentUpdate(nextElement, nextProps, nextState);
		}
		inst.props = nextProps;
		inst.state = nextState;
	}

	private performComponentUpdate(nextElement: VNode, nextProps: Props, nextState: IState) {
		this.currentElement = nextElement;
		const inst = this.instance;
		inst.props = nextProps;
		inst.state = nextState;

		this.updateRenderedComponent();
	}

	public performUpdateIfNecessary() {
		// Т.к изменяются не пропсы, то закидываем один и тот же элемент
		this.updateComponent(this.currentElement, this.currentElement);
	}

	public forceUpdate() {
		this.updateRenderedComponent();
	}

	private updateRenderedComponent() {
		const prevComponentInstance = this.renderedComponent;
		const inst = this.instance;
		const nextRenderedElement = inst.render();
		FeactReconciler.receiveComponent(prevComponentInstance, nextRenderedElement);
	}

	public unMount() {
		const inst = this.instance;

		inst.componentWillUnmount?.();
		inst.__clearStoreDeps?.();
		this.renderedComponent.unMount();
	}

	public mountComponent(container: CustomHTMLElement) {
		// Возвращаем составной компонент
		const Component = this.currentElement.tag as ICompositeComponent;
		// Создаем инстанс
		const componentInstance = new Component(this.currentElement.props);
		this.instance = componentInstance;
		FeactInstanceMap.set(componentInstance, this);

		componentInstance.componentWillMount?.();

		const markup = this.performInitialMount(container);

		componentInstance.componentDidMount?.();
		return markup;
		// пока вызывается составной компонент повторяем
	}

	public replaceComponent() {
		// Возвращаем составной компонент
		const Component = this.currentElement.tag as ICompositeComponent;
		// Создаем инстанс
		const componentInstance = new Component(this.currentElement.props);
		if (!this.instance) {
			this.instance = componentInstance;
		} else {
			this.instance.componentWillUnmount?.();
			this.instance = componentInstance;
		}

		FeactInstanceMap.set(componentInstance, this);

		const markup = this.performReplace();

		return markup;
		// пока вызывается составной компонент повторяем
	}
}
