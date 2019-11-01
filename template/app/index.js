
import React from 'react';
import { render } from 'react-dom';
{{#useRedux}}
import { Provider } from 'react-redux';
import store from './src/browser/redux/store';
{{/useRedux}}

		const renderApp = () => {
			{{#useRouter}}
			const Routers = require('./src/browser/routers').default;
			{{/useRouter}}
			{{^useRouter}}
			const App = require('./src/browser/components/App').default;
			{{/useRouter}}
			render(
				{{#useRedux}}
				<Provider store={store}>
				{{/useRedux}}
					<{{routerComponent}} />{{^useRedux}},{{/useRedux}}
				{{#useRedux}}
				</Provider>,
				{{/useRedux}}
				document.getElementById('app')
			);
		};
		if (module.hot) {
			{{#useRouter}}
			module.hot.accept('./src/browser/routers', () => {
			{{/useRouter}}
			{{^useRouter}}
			module.hot.accept('./src/browser/components/App', () => {
			{{/useRouter}}
				renderApp();
			});
		}
		renderApp();
	}
