export const setSocket = socket => async(dispatch, getState) => {
    dispatch({
        type:'SOCKET',
        payload: socket
    });

};


export const setClearSocket = socket => async(dispatch, getState) => {
    dispatch({
        type:'CLEAR_SOCKET',
    })
}

