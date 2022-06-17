export const setRecording = recording => async(dispatch, getState) => {
    dispatch({
        type:'RECORDING',
        payload: recording
    });

};


export const setClearRecording = recording => async(dispatch, getState) => {
    dispatch({
        type:'CLEAR_RECORDING',
    })
}

