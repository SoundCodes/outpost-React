const defaultState = null;


export default(state = defaultState,action)=>{
    switch(action.type){
        case'REMOTESTREAM':
        return action.payload ? action.payload : null;
        case 'CLEAR_REMOTESTREAM':
            return null;
            default:
                return state;
    }
}