import { CustomHTMLElement, Listeners, Props, VNode } from '@/core/Feact/feactTypes';
import { FeactReconciler, instantiateFeactComponent } from '@/core/Feact/utils/feactUtils';

export default class FeactDomComponent {
	private currentElement;
	public hostNode: HTMLElement;
	private listeners: Listeners = [];
	private childrens: any[] = [];

	constructor(element: VNode) {
		this.currentElement = element;
	}

	receiveComponent(nextElement: VNode) {
		const prevElement = this.currentElement;
		this.updateComponent(prevElement, nextElement);
	}

	updateComponent(prevElement: VNode, nextElement: VNode) {
		const lastProps = prevElement.props;
		const nextProps = nextElement.props;
		if (prevElement.tag !== nextElement.tag) {
			const parent = this.hostNode.parentElement!;
			this.unMount();
			this.currentElement = nextElement;
			FeactReconciler.mountComponent(this, parent);
		} else {
			this.updateDOMChildren(lastProps, nextProps);
			this.currentElement = nextElement;
		}
	}

	// private updateDOMProperties(lastProps: Props, nextProps: Props) {
	//
	// }
	private updateDOMChildren(lastProps: Props, nextProps: Props) {
		const lastContent = lastProps.children;
		const nextContent = nextProps.children;
		const newProps = { ...nextProps };
		// Функция для проверки обновления виртуальной ноды
		Object.keys(lastProps).forEach((key) => {
			if (key === 'children') {
				delete newProps[key];

				const commonLength = Math.min(lastContent!.length, nextContent!.length);

				Array.from({ length: commonLength }).forEach((_el, i) => {
					if (this.childrens[i].nodeType === 3) {
						if ((nextContent![i] as VNode).tag) {
							const inst = instantiateFeactComponent(nextContent![i] as VNode);
							const newComponent = FeactReconciler.replaceComponent(inst);
							this.hostNode.replaceChild(newComponent, this.childrens[i]);
							this.childrens[i] = inst;
							return;
						}
						this.childrens[i].textContent = nextContent![i];
						return;
					}
					this.childrens[i].updateComponent(lastContent![i], nextContent![i]);
				});

				if (commonLength < nextContent!.length) {
					for (let i = commonLength; i < nextContent!.length; i++) {
						if (typeof nextContent![i] === 'string') {
							const textNode = document.createTextNode(nextContent![i] as string);

							this.hostNode.append(textNode);
							this.childrens.push(textNode);
							continue;
						}

						const inst = instantiateFeactComponent(nextContent![i] as VNode);
						FeactReconciler.mountComponent(inst, this.hostNode);
						this.childrens.push(inst);
					}
				} else if (commonLength < lastContent!.length) {
					for (let i = commonLength; i !== lastContent!.length; i++) {
						this.childrens.pop().unMount();
					}
				}
			} else if (key[0] === '@') {
				this.listeners.every((listener) => {
					if (listener[key.slice(1)] === lastProps[key]) {
						listener[key.slice(1)] = nextProps[key];
						return false;
					}

					return true;
				});

				this.hostNode.removeEventListener(key.slice(1), lastProps[key]);
				this.listeners = this.listeners.filter(
					(listener) => Object.keys(listener)[0] !== key.slice(1),
				);
				this.hostNode.addEventListener(key.slice(1), nextProps[key]);
				this.listeners.push({ [key.slice(1)]: nextProps[key] });

				if (nextProps[key]) {
					delete newProps[key];
				}
			} else if (lastProps[key] !== nextProps[key]) {
				this.hostNode.removeAttribute(key);
				if (nextProps[key]) {
					this.hostNode.setAttribute(key, nextProps[key]);
					delete newProps[key];
				}
			}
		});

		Object.keys(newProps).forEach((key) => {
			if (key[0] === '@') {
				this.hostNode.addEventListener(key.slice(1), this.currentElement.props[key]);
				this.listeners.push({ [key.slice(1)]: this.currentElement.props[key] });
				return;
			}

			this.hostNode.setAttribute(key, newProps[key]);
		});

		// ЗАМЕТКА component will mount
	}

	private renderChildren(container: CustomHTMLElement) {
		this.currentElement.props.children?.forEach((child) => {
			// Если ребенок текстовый узел
			if (typeof child === 'string') {
				const textNode = document.createTextNode(child);
				container.append(textNode);
				this.childrens.push(textNode);
			} else {
				const instance = instantiateFeactComponent(child);
				this.childrens.push(instance);
				FeactReconciler.mountComponent(instance, container);
			}
		});
	}

	private applyAttributes(node: HTMLElement) {
		Object.keys(this.currentElement.props).forEach((key) => {
			if (key === 'children') {
				return;
			}

			if (key[0] === '@') {
				node.addEventListener(key.slice(1), this.currentElement.props[key]);
				this.listeners.push({ [key.slice(1)]: this.currentElement.props[key] });
			} else {
				node.setAttribute(key, this.currentElement.props[key]);
			}
		});
	}

	public clearDeps(removeNodes: boolean) {
		// Удалить слушателей, удалить детей, удалить хостноду
		this.listeners.forEach((listener) => {
			Object.keys(listener).forEach((key) => {
				this.hostNode.removeEventListener(key, listener[key]);
			});
		});

		this.listeners = [];

		this.childrens.forEach((child) => {
			if (child.nodeType === 3) {
				return;
			}

			child.unMount(removeNodes);
		});

		this.childrens = [];
	}

	public forceUpdate() {
		this.updateComponent(this.currentElement, this.currentElement);
	}

	public unMount(removeNodes = true) {
		this.clearDeps(removeNodes);
		removeNodes && this.hostNode.remove();
	}

	public mountComponent(container: HTMLElement) {
		const domElement = document.createElement(this.currentElement.tag as string);

		this.applyAttributes(domElement);
		this.renderChildren(domElement);

		container.appendChild(domElement);
		this.hostNode = domElement;
		return domElement;
	}

	public replaceComponent() {
		const domElement = document.createElement(this.currentElement.tag as string);

		this.applyAttributes(domElement);
		this.renderChildren(domElement);

		this.hostNode = domElement;
		return domElement;
	}
}
