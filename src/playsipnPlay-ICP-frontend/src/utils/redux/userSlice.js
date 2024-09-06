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
    }, 
    updateBalance: (state, action) => {
      state.balance = action.payload.balance;
    },
    removeUserData: (state) => {
      state.id = null;
      state.email = '';
      state.balance = 0;
    },

  }
});

export const { addUserData, updateBalance, removeUserData } = userSlice.actions;
export default userSlice.reducer;
