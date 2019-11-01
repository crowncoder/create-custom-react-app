// Action Types
const SHOW_SPINNER = 'SHOW_SPINNER';
const HIDE_SPINNER = 'HIDE_SPINNER';
const SPINNER_MESSAGE = 'loading...';
// Initial state
const initialState = {
	show: false,
	blocking: false,
	message: SPINNER_MESSAGE
};
// Reducer
export default function(state = initialState, action) {
	switch (action.type) {
		case SHOW_SPINNER: {
			return { ...state, show: action.show, blocking: action.blocking };
		}
		case HIDE_SPINNER: {
			return { ...state, show: action.show };
		}
		default: {
			return state;
		}
	}
}
// Action Creators
export const spinnerActions = {
	showSpinner: (message, blocking = true) => ({
		type: SHOW_SPINNER,
		show: true,
		message,
		blocking
	}),
	hideSpinner: () => ({
		type: HIDE_SPINNER,
		show: false
	})
};
