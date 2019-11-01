const errorHandler = (error, getState, lastAction) => {
	console.error(error.stack || error);
	console.debug('current state', getState());
	console.debug('last action was', lastAction);
};

const errorHandlerMiddleware = onError => ({ dispatch, getState }) => next => async action => {
	try {
		return await next(action);
	} catch (err) {
		getState().spinner.show && dispatch({ type: 'spinner/hideSpinner' });
		onError(err, getState, action);
	}
};

export default errorHandlerMiddleware(errorHandler);
