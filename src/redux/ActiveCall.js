export const setActiveCall = activeCall => async(dispatch, getState) => {
    dispatch({
        type:'ACTIVECALL',
        payload: activeCall
    });

};


export const setClearActiveCall = activeCall => async(dispatch, getState) => {
    dispatch({
        type:'CLEAR_ACTIVECALL',
    })
}

