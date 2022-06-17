export const setRemoteStream = remoteStream => async(dispatch, getState) => {
    dispatch({
        type:'REMOTESTREAM',
        payload: remoteStream
    });

};


export const setClearRemoteStream = remoteStream => async(dispatch, getState) => {
    dispatch({
        type:'CLEAR_REMOTESTREAM',
    })
}

