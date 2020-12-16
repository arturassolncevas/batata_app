import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import authReducer from "./reducers/authReducer";
import menuReducer from "./reducers/menuReducer";
import cartReducer from "./reducers/cartReducer";
import thunk from "redux-thunk";

let store = createStore(
    combineReducers({ authReducer, menuReducer, cartReducer }),
    compose(
        applyMiddleware(thunk),
        //TODO
        //description: Some kind of dev tool etension setup for redux that does not work on local linux
        //could be nice to make run script in package.json with ENV var flag
        //if process.env.<flag> == true then 
        //window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    )
);

export default store;
