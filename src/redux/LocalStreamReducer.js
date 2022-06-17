const defaultState = null;


export default(state = defaultState,action)=>{
    switch(action.type){
        case'LOCALSTREAM':
        return action.payload ? action.payload : null;
        case 'CLEAR_LOCALSTREAM':
            return null;
            default:
                return state;
    }
}