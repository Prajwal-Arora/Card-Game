import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./reducer/userReducer";
import walletReducer from "./reducer/walletReducer";
import soundReducer from "./reducer/soundReducer";
import { store } from "./store";


const rootReducer = combineReducers({
    walletConnect: walletReducer,
    userDetail:userReducer,
    sounds: soundReducer
});

// store.replaceReducer(rootReducer)
export default rootReducer;