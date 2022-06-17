const defaultState = null;


export default(state = defaultState,action)=>{
    switch(action.type){
        case'SOCKET':
        return action.payload ? action.payload : null;
        case 'CLEAR_SOCKET':
            return null;
            default:
                return state;
    }
}