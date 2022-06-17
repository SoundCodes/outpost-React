export const setLocalStream = localStream => async(dispatch, getState) => {
    dispatch({
        type:'LOCALSTREAM',
        payload: localStream
    });

};


export const setClearLocalStream = localStream => async(dispatch, getState) => {
    dispatch({
        type:'CLEAR_LOCALSTREAM',
    })
}

