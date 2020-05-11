import { createStore, combineReducers, applyMiddleware } from 'redux'
import authReducer from './reducers/authReducer'
import menuReducer from './reducers/menuReducer'
import thunk from 'redux-thunk'

let store = createStore(combineReducers({ authReducer, menuReducer }), applyMiddleware(thunk))

export default store