const defaultState = null;


export default(state = defaultState,action)=>{
    switch(action.type){
        case'RECORDING':
        return action.payload ? action.payload : null;
        case 'CLEAR_RECORDING':
            return null;
            default:
                return state;
    }
}