import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
    riskFactor:'10'
};

export const commonSlice = createSlice({
    name: "userReducer",
    initialState,
    reducers: {
        setRiskFactor: (state, action: PayloadAction<string>) => {
            state.riskFactor = action.payload;
        },
    }
})



export const { setRiskFactor} = commonSlice.actions;
export default commonSlice.reducer;