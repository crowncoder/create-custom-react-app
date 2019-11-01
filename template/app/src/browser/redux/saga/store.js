import rootReducers from './rootReducer';
import { applyMiddleware, createStore } from 'redux';
import rootSaga from './sagas';
import { errorHandlerMiddleware, sagaMiddleware } from './middlewares';
const configureStore = () => {
	const store = createStore(rootReducers, applyMiddleware(sagaMiddleware, errorHandlerMiddleware));
	sagaMiddleware.run(rootSaga);
	if (module.hot) {
		// Enable Webpack hot module replacement for reducers
		module.hot.accept('./rootReducer', () => {
			const nextReducer = require('./rootReducer').default;
			store.replaceReducer(nextReducer);
		});
	}
	return store;
};
const store = configureStore();
export default store;
