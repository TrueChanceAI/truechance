import { IUser } from "@/types/me";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IInitialState {
  user: IUser | null;
}

const initialState: IInitialState = {
  user: null,
};

const meSlice = createSlice({
  name: "me",
  initialState,
  reducers: {
    setMe: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
    },
    resetMeState: (state) => {
      state.user = null;
    },
  },
});

export default meSlice.reducer;
export const { setMe, resetMeState } = meSlice.actions;
