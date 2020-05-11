import ACTIONS from '../action_types/MenuActionTpes'

//ACTIONS
export const triggerMenu = () => {
  return async (dispatch) => {
    dispatch({
      type: ACTIONS.MENU_TRIGGER
    })
  }
}