const defaultState = null;


export default(state = defaultState,action)=>{
    switch(action.type){
        case'SPECTOGRAPH':
        return action.payload ? action.payload : null;
        case 'CLEAR_SPECTOGRAPH':
            return null;
            default:
                return state;
    }
}