const initialState = {
	show: false,
	blocking: false,
	message: ''
};

export default {
	state: initialState,
	reducers: {
		showSpinner: (state, message = '', blocking = true) => ({
			show: true,
			blocking,
			message
		}),
		hideSpinner: () => initialState
	}
};
