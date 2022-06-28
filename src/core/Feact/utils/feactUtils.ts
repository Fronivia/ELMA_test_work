import { Feact } from '@/core/Feact/Feact';
import FeactCompositeWrapper from '@/core/Feact/FeactCompositeWrapper';
import FeactDomComponent from '@/core/Feact/FeactDomComponent';
import { CustomHTMLElement, feactComponent, VNode } from '@/core/Feact/feactTypes';
import TopLevelWrapper from '@/core/Feact/TopLevelWrapper';

export function instantiateFeactComponent(element: VNode) {
	if (typeof element.tag === 'string') {
		return new FeactDomComponent(element);
	}

	return new FeactCompositeWrapper(element);
}

// Определитель, которая вызывает методы у обоих видов компонента
export const FeactReconciler = {
	mountComponent(
		internalInstance: feactComponent,
		container: CustomHTMLElement,
	): CustomHTMLElement {
		return internalInstance.mountComponent(container);
	},
	receiveComponent(internalInstance: feactComponent, nextElement: VNode) {
		internalInstance.receiveComponent(nextElement);
	},
	performUpdateIfNecessary(internalInstance: FeactCompositeWrapper) {
		internalInstance.performUpdateIfNecessary();
	},
	replaceComponent(internalInstance: feactComponent): CustomHTMLElement {
		return internalInstance.replaceComponent();
	},
	forceUpdate(internalInstance: feactComponent) {
		internalInstance.forceUpdate();
	},
};

// функция, что бы вытаскивать из ноды прошлую модель
export function getTopLevelComponentInContainer(container: CustomHTMLElement) {
	return container.__feactComponentInstance;
}

// Функция, что бы обновить модель после перерендера
export function updateRootComponent(
	prevComponent: FeactCompositeWrapper | FeactDomComponent,
	nextElement: VNode,
) {
	FeactReconciler.receiveComponent(prevComponent, nextElement);
}

// Функция для первого рендера
export function renderNewRootComponent(element: VNode, container: CustomHTMLElement) {
	// оборачивает элемент
	const wrapperElement = Feact.createElement(TopLevelWrapper, element);
	// Делает из элемента Виртуальную ноду
	const componentInstance = new FeactCompositeWrapper(wrapperElement);
	const markUp = FeactReconciler.mountComponent(componentInstance, container);
	container.__feactComponentInstance = componentInstance.renderedComponent;
	return markUp;
}

// Функция которая делает внутренние экземпляры общедоступными
export const FeactInstanceMap = {
	set(key: any, value: any) {
		key.__feactComponentInstance = value;
	},

	get(key: any) {
		return key.__feactComponentInstance;
	},
};
