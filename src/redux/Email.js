export const setEmail = email => async(dispatch, getState) =>{
dispatch({
    type: 'EMAIL',
    payload:email,
});
};

export const setClearEmail = email => async(dispatch, getState) =>{
    dispatch({
        type: 'CLEAR_EMAIL',
    })
}