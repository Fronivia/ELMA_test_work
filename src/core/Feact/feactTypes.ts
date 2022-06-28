import FeactCompositeWrapper from '@/core/Feact/FeactCompositeWrapper';
import FeactDomComponent from '@/core/Feact/FeactDomComponent';
import TopLevelWrapper from '@/core/Feact/TopLevelWrapper';

interface IObj {
	[key: string]: any;
}

export interface IState {
	[key: string]: any;
}

export type feactComponent = FeactCompositeWrapper | FeactDomComponent;

export type CustomHTMLElement = HTMLElement & {
	__feactComponentInstance?: feactComponent;
};

export type CompositionWrapperInstance = { new: FeactCompositeWrapper };

export interface IComponent {
	props: IObj;
	state: IState;

	render(): VNode;

	forceUpdate(): void;

	__clearStoreDeps?(): void;

	componentWillMount?(): void;

	componentDidMount?(): void;

	shouldComponentUpdate?(nextProps: Props, nextState: IState): boolean;

	componentWillUnmount?(): void;
}

export interface ICompositeComponent<T = {}> {
	new (props?: Props): T & IComponent;

	// ЗАМЕТКА
	getInitialState: IState;
}

export type Tag<T = any> = T extends string
	? string
	: ICompositeComponent<T> | { new (props: Props): TopLevelWrapper };

export interface VNode {
	tag: Tag;
	props: Props;
}

export type Children = Array<VNode | string>;

export type Props = {
	children?: Children;

	[key: string]: any;
};

export type Listeners = Array<{ [key: string]: (event: Event) => void }>;

export interface IStores {
	[key: string]: any;
}
