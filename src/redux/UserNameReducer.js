const defaultState = null;


export default(state = defaultState,action)=>{
    switch(action.type){
        case'USERNAME':
        return action.payload ? action.payload : null;
        case 'CLEAR_USERNAME':
            return null;
            default:
                return state;
    }
}