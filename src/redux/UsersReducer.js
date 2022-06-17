const defaultState = null;

export default (state = defaultState, action) => {
	switch (action.type) {
		case 'USERS':
			return action.payload ? action.payload : null;
		case 'CLEAR_USERS':
			return null;
		default:
			return state;
	}
}