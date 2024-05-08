import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {},
};

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    login: (state, action) => {
      state.value = {
        firstname: action.payload.firstname,
        username: action.payload.username,
        token: action.payload.token,
        // id: action.payload.id,
      };
    },
    logout: (state, action) => {
      state.value = {};
    },
  },
});

export const { login, logout } = usersSlice.actions;
export default usersSlice.reducer;
