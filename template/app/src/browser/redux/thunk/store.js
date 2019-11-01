import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducers from './rootReducer';
import errorMiddleware from './middlewares/errorHandler';
import Service from '../services';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const enhancers = compose(
	composeEnhancers(
		applyMiddleware(
			thunk.withExtraArgument({
				Service
			})
		),
		applyMiddleware(errorMiddleware)
	)
);
const store = createStore(rootReducers, enhancers);

if (module.hot) {
	module.hot.accept('./rootReducer', () => {
		store.replaceReducer(require('./rootReducer').default);
	});
}

export default store;
