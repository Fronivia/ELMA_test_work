import Aside from '@/components/Aside/Aside';
import MainPage from '@/components/MainPage/MainPage';
import observer from '@/components/Store/observer';
import { Feact } from '@/core/Feact/Feact';
import htmx from '@/htmx/htmx';

class App extends Feact.Component {
	public componentDidMount() {
		this.stores.dataStore.getData();
	}

	render() {
		return htmx`
			<div class='container'>
				<${MainPage}/>
				<${Aside}/>
			</div>
		`;
	}
}

export default observer(App, {
	dataStore: [],
});
