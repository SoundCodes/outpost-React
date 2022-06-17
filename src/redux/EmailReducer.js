const defaultState = null;

export default(state = defaultState,action)=> {
switch(action.type){
	case 'EMAIL':
		return action.payload ? action.payload : null;
		case 'CLEAR_EMAIL':
			return null;
		  default:
			return state;
}
}