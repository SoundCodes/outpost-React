export const setUserName = userName => async(dispatch, getState) => {
    dispatch({
        type:'USERNAME',
        payload: userName
    });

};


export const setClearUserName = userName => async(dispatch, getState) => {
    dispatch({
        type:'CLEAR_USERNAME',
    })
}

