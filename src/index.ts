import App from '@/components/App/App';
import { Feact } from '@/core/Feact/Feact';
import '@assets/styles/main.scss';

Feact.render(Feact.createElement(App, null), document.getElementById('root')!);
