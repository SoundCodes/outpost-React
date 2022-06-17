const defaultState = null;


export default(state = defaultState,action)=>{
    switch(action.type){
        case'PEERSERVER':
        return action.payload ? action.payload : null;
        case 'CLEAR_PEERSERVER':
            return null;
            default:
                return state;
    }
}