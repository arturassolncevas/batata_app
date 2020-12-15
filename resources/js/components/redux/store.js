import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import authReducer from "./reducers/authReducer";
import menuReducer from "./reducers/menuReducer";
import cartReducer from "./reducers/cartReducer";
import thunk from "redux-thunk";

let store = createStore(
    combineReducers({ authReducer, menuReducer, cartReducer }),
    compose(
        applyMiddleware(thunk),
/*         window.__REDUX_DEVTOOLS_EXTENSION__ &&
            window.__REDUX_DEVTOOLS_EXTENSION__() */
    )
);

export default store;
