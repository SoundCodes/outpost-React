const defaultState = null;


export default(state = defaultState,action)=>{
    switch(action.type){
        case'PEERID':
        return action.payload ? action.payload : null;
        case 'CLEAR_PEERID':
            return null;
            default:
                return state;
    }
}