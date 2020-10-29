import ACTIONS from '../action_types/CartActionTypes'

const initialState = {
  cart: {},
}

const cartReducer = function (state = initialState, action) {
  let newState = { }
  switch (action.type) {
    case ACTIONS.SET_CART:
      newState= { cart: action.payload } 
      break;
    default:
      newState = state
      break;
  }
  return newState
};

export default cartReducer