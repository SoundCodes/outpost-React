const defaultState = null;


export default(state = defaultState,action)=>{
    switch(action.type){
        case'WAVEFORM':
        return action.payload ? action.payload : null;
        case 'CLEAR_WAVEFORM':
            return null;
            default:
                return state;
    }
}