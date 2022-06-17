const defaultState = null;

export default (state = defaultState, action) => {
  switch (action.type) {
    case 'TOKEN':
      return action.payload ? action.payload : null;
    case 'CLEAR_TOKEN':
      return null;
    default:
      return state;
  }
};
