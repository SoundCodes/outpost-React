export const setUserId = userId => async(dispatch, getState) => {
    dispatch({
        type:'USERID',
        payload: userId
    });

};


export const setClearUserId = userId => async(dispatch, getState) => {
    dispatch({
        type:'CLEAR_USERID',
    })
}

