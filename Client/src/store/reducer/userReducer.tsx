import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { io } from "socket.io-client";
import { getLocalStore } from "../../common/localStorage";

  

const initialState = {
    riskFactor:'10',
    socket:'',
    battleArray:[],
};

export const commonSlice = createSlice({
    name: "userReducer",
    initialState,
    reducers: {
        setRiskFactor: (state, action: PayloadAction<string>) => {
            state.riskFactor = action.payload;
        },
        setSocket: (state, action: PayloadAction<any>) => {
            state.socket = action.payload;
        },
        setBattleArray:(state, action: PayloadAction<[]>)=>{
            state.battleArray = action.payload;
        },

    }
})



export const { setRiskFactor,setSocket,setBattleArray} = commonSlice.actions;
export default commonSlice.reducer;