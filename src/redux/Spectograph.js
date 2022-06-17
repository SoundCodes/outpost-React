export const setSpectograph = spectograph => async(dispatch, getState) => {
    dispatch({
        type:'SPECTOGRAPH',
        payload: spectograph
    });

};


export const setClearSpectograph = spectograph => async(dispatch, getState) => {
    dispatch({
        type:'CLEAR_SPECTOGRAPH',
    })
}

