export const setWaveform = waveform => async(dispatch, getState) => {
    dispatch({
        type:'WAVEFORM',
        payload: waveform
    });

};


export const setClearWaveform = waveform => async(dispatch, getState) => {
    dispatch({
        type:'CLEAR_WAVEFORM',
    })
}

