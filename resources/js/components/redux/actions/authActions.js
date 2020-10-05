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
            return response.data
          default:
            break
        }
      }).catch((error) => {
        switch (error.response.status) {
          case 401:
            console.log("Unauthorized")
            break;
          default:
            console.log("error in action")
        }
      })
  }
}

export const logOut = () => {
  return async (dispatch) => {
    return requestClient.get('/api/logout')
      .then(async (response) => {
        switch (response.status) {
          case 200:
            localStorage.removeItem("token")
            await dispatch({
              type: ACTIONS.AUTH_LOGOUT,
            })
            localStorage.removeItem("details")
          default:
            break
        }
      }).catch((error) => {
        console.log(error)
      })
  }
}