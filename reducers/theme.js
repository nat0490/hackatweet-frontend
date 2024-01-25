import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: 'light',
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    changeTheme: (state, action) => {
        if (state.value === 'light') {
            state.value = 'dark';
        } else if (state.value === 'dark') {
            state.value = "light";
        }
    },
  },
});

export const { changeTheme } = themeSlice.actions;
export default themeSlice.reducer;