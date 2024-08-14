import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: null,
  email: null,
  balance: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addUserData: (state, action) => {
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.balance = action.payload.balance;
      // Balance is not fetched here because it will be fetched separately.
    },
    updateUserData: (state, action) => {
      if (action.payload.email) state.email = action.payload.email;
      if (action.payload.id) state.id = action.payload.id;
      if (action.payload.balance) state.balance = action.payload.balance;
    },
    removeUserData: (state) => {
      state.id = null;
      state.email = '';
      state.balance = 0;
    },
  }
});

export const { addUserData, updateUserData, removeUserData } = userSlice.actions;
export default userSlice.reducer;
