import ACTIONS from '../action_types/MenuActionTpes'

const initialState = {
  opened: true,
}

const reducer = function (state = initialState, action) {
  let newState = {}
  switch (action.type) {
    case ACTIONS.MENU_TRIGGER:
      newState= { opened: !state.opened } 
      break;
    default:
      newState = state
      break;
  }
  return newState
};

export default reducer