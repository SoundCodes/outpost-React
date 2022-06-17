export const setToken = token => async (dispatch, getState) => {
    dispatch({
      type: 'TOKEN',
      payload: token
    });
  };
  
  export const setClearToken = () => async (dispatch, getState) => {
    dispatch({
      type: 'CLEAR_TOKEN'
    });
  };
  