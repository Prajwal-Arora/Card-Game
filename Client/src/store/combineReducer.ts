import { combineReducers } from "@reduxjs/toolkit";
import walletReducer from "./reducer/WalletReducer/walletReducer";
import { store } from "./store";


const rootReducer = combineReducers({
    walletConnect: walletReducer,

});

// store.replaceReducer(rootReducer)
export default rootReducer;