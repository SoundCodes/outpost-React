const defaultState = null;


export default(state = defaultState,action)=>{
    switch(action.type){
        case'REMOTEUSER':
        return action.payload ? action.payload : null;
        case 'CLEAR_REMOTEUSER':
            return null;
            default:
                return state;
    }
}