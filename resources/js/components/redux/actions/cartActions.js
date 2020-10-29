import ACTIONS from '../action_types/CartActionTypes'

//ACTIONS 
export const setCart = (data) => {
  return async (dispatch) => {
    return dispatch({
      type: ACTIONS.SET_CART,
      payload: data
    })
  }
}

export const refreshCart = () => {
  return async (dispatch) => {
    return requestClient.get('/api/products/get_cart_content')
      .then(async (response) => {
        switch (response.status) {
          case 200:
            dispatch(setCart(response.data))
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