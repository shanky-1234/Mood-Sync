import { createSlice } from "@reduxjs/toolkit";

const dailyRewardSlice = createSlice({
  name: "dailyReward",
  initialState: { dailyReward: null },
  reducers: {
    setDailyReward: (state, action) => {
      state.dailyReward = action.payload;
    },
  },
});

export const { setDailyReward } = dailyRewardSlice.actions;
export default dailyRewardSlice.reducer;