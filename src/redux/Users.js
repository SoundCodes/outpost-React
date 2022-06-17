export const setUsers = users => async(dispatch, getState) =>{
dispatch({
    type: 'USERS',
    payload:users,
});
};

export const setClearUsers = users => async(dispatch, getState) =>{
    dispatch({
        type: 'CLEAR_USERS',
    })
}