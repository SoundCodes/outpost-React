export const setPeerServer = peerServer => async(dispatch, getState) => {
    dispatch({
        type:'PEERSERVER',
        payload: peerServer
    });

};


export const setClearPeerServer = peerServer => async(dispatch, getState) => {
    dispatch({
        type:'CLEAR_PEERSERVER',
    })
}

