export const setRemoteUser = remoteUser => async(dispatch, getState) => {
    dispatch({
        type:'REMOTEUSER',
        payload: remoteUser
    });

};


export const setClearRemoteUser = remoteUser => async(dispatch, getState) => {
    dispatch({
        type:'CLEAR_REMOTEUSER',
    })
}

