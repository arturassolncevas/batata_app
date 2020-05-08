import ACTIONS from '../action_types/AuthActionTypes'

const initialState = {
  isLogged: false,
  user: {
    name: "",
    email: "",
    roles: []
  },
}

const authReducer = function (state = initialState, action) {
  let newState = {}
  switch (action.type) {
    case ACTIONS.AUTH_SIGNIN:
      newState= { isLogged: true, user: { ...action.payload } } 
      break;
    case ACTIONS.AUTH_LOGOUT:
      newState= { isLogged: false, user: { ...initialState.user } } 
      break;
    default:
      newState = state
      break;
  }
  return newState
};

export default authReducer