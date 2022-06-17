export const setPeerId = peerId => async(dispatch, getState) => {
    dispatch({
        type:'PEERID',
        payload: peerId
    });

};


export const setClearPeerId = peerId => async(dispatch, getState) => {
    dispatch({
        type:'CLEAR_PEERID',
    })
}

