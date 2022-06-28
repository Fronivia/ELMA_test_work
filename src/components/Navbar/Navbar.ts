import observer from '@/components/Store/observer';
import { Feact } from '@/core/Feact/Feact';
import htmx from '@/htmx/htmx';
import '@assets/styles/navbar.scss';

class Navbar extends Feact.Component {
	render() {
		return htmx`
			<nav class='navbar'>
				<button class='navbar__button' @click=${() => this.stores.schedulerStore.stepLeft()}>Left</button>
				<button class='navbar__button' @click=${() => this.stores.schedulerStore.stepRight()}>Right</button>
			</nav>
		`;
	}
}

export default observer(Navbar, { schedulerStore: [] });
