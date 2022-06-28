import Navbar from '@/components/Navbar/Navbar';
import Scheduler from '@/components/Scheduler/Scheduler';
import { Feact } from '@/core/Feact/Feact';
import htmx from '@/htmx/htmx';

export default class MainPage extends Feact.Component {
	render() {
		return htmx`
			<main class='main'>
				<${Navbar} />
				<${Scheduler} />
			</main>
		`;
	}
}
