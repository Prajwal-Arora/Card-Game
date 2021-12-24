import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { io } from "socket.io-client";
import { getLocalStore } from "../../common/localStorage";

const initialState = {
  backgroundMusic: false,
  volume: 0
};

export const soundSlice = createSlice({
    name: "soundReducer",
    initialState,
    reducers: {
      setBackgroundMusic: (state, action: PayloadAction<boolean>) => {
          state.backgroundMusic = action.payload;
      },
      setVolume: (state, action: PayloadAction<number>) => {
        state.volume = action.payload
      }
    }
})

export const { setBackgroundMusic, setVolume } = soundSlice.actions;
export default soundSlice.reducer;