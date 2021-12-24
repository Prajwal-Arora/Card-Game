import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getLocalStore } from "../../common/localStorage";

const initialState = {
  riskFactor: "10",
  socket: "",
  battleArray: [],
  scoreRound1: {},
  scoreRound2: {},
  scoreRound3: {},
  endClick: false,
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
    setBattleArray: (state, action: PayloadAction<[]>) => {
      state.battleArray = action.payload;
    },
    setScoreRound1: (state, action: PayloadAction<{}>) => {
      state.scoreRound1 = action.payload;
    },
    setScoreRound2: (state, action: PayloadAction<{}>) => {
      state.scoreRound2 = action.payload;
    },
    setScoreRound3: (state, action: PayloadAction<{}>) => {
      state.scoreRound3 = action.payload;
    },
    setEndClick: (state, action: PayloadAction<boolean>) => {
      state.endClick = action.payload;
    },
  },
});

export const {
  setRiskFactor,
  setSocket,
  setBattleArray,
  setScoreRound1,
  setScoreRound2,
  setScoreRound3,
  setEndClick,
} = commonSlice.actions;
export default commonSlice.reducer;
