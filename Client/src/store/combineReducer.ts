import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./reducer/userReducer";
import walletReducer from "./reducer/walletReducer";
import { store } from "./store";


const rootReducer = combineReducers({
    walletConnect: walletReducer,
    userDetail:userReducer

});

// store.replaceReducer(rootReducer)
export default rootReducer;