const defaultState = null;


export default(state = defaultState,action)=>{
    switch(action.type){
        case'USERID':
        return action.payload ? action.payload : null;
        case 'CLEAR_USERID':
            return null;
            default:
                return state;
    }
}