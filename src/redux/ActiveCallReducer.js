const defaultState = null;


export default(state = defaultState,action)=>{
    switch(action.type){
        case'ACTIVECALL':
        return action.payload ? action.payload : null;
        case 'CLEAR_ACTIVECALL':
            return null;
            default:
                return state;
    }
}