import ACTIONS from '../action_types/AuthActionTypes'

// SELECTOR
export const selectTodos = state => state.authReducer;

//ACTIONS
export const signIn = () => {
  return async (dispatch) => {
    return requestClient.get('/api/user/details')
      .then(async (response) => {
        switch (response.status) {
          case 200:
            await dispatch({
              type: ACTIONS.AUTH_SIGNIN,
              payload: response.data
            })
            localStorage.setItem("details", JSON.stringify(response.data))
            console.log("after signin")
          default:
            break
        }
      }).catch((error) => {
        console.log("error in action")
      })
  }
}

export const logOut = () => {
  return async (dispatch) => {
    return requestClient.get('/api/logout')
      .then((response) => {
        switch (response.status) {
          case 200:
            localStorage.removeItem("token")
            dispatch({
              type: ACTIONS.AUTH_LOGOUT,
            })
          default:
            break
        }
      }).catch((error) => {
        console.log(error)
      })
  }
}