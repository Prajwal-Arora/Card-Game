import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  riskFactor: "10",
  amountLocked:"",
  socket: "",
  battleArray: [],
  scoreRound1: {},
  scoreRound2: {},
  scoreRound3: {},
  endClick: false,
  eventClickable:true
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
    setAmountLocked: (state, action: PayloadAction<any>) => {
      state.amountLocked = action.payload;
    },
    setEventClickable: (state, action: PayloadAction<any>) => {
      state.eventClickable = action.payload;
    },
  },
});

export const {
  setRiskFactor,
  setEventClickable,
  setSocket,
  setBattleArray,
  setScoreRound1,
  setScoreRound2,
  setScoreRound3,
  setAmountLocked,
  setEndClick,
} = commonSlice.actions;
export default commonSlice.reducer;
