import { init } from '@rematch/core';
import { combineReducers } from 'redux';
import errorMiddleware from './middlewares/errorHandler';
import models from './models';

// generate Redux store
const store = init({
	models,
	redux: {
		middlewares: [errorMiddleware],
		combineReducers: reducers => combineReducers(reducers)
	}
});

if (module.hot) {
	module.hot.accept('./models', () => {
		// need to call require again to load the latest file
		const newModels = require('./models').default;

		Object.keys(newModels).forEach(modelKey => {
			store.model({
				name: modelKey,
				...newModels[modelKey]
			});
		});
	});
}

export default store;
