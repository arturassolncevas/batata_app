import { createStore, combineReducers, applyMiddleware } from 'redux'
import authReducer from './reducers/authReducer'
import thunk from 'redux-thunk'

let store = createStore(combineReducers({ authReducer }), applyMiddleware(thunk))

export default store