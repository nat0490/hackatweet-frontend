import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    addTheme: (state, action) => {
      //console.log(addTheme);
      if (!state.value.some(e => e.user === action.payload.user )){
        const {user, style} = action.payload;
        state.value.push({
          user: user,
          style: style,
        });
      } ;
    },
    changeTheme: (state, action) => {
      const userIndex = state.value.findIndex(e => e.user === action.payload);
      if (userIndex !== -1) {
        // L'utilisateur a été trouvé
        const updatedTheme = {
          ...state.value[userIndex],
          style: state.value[userIndex].style === 'light' ? 'dark' : 'light',
        };
        state.value = [
          ...state.value.slice(0, userIndex),
          updatedTheme,
          ...state.value.slice(userIndex + 1),
        ];
      } else {
        console.log("Utilisateur non trouvé");
        addTheme(state, action);
      }
    },
    resetTheme: (state,action) => {
      state.value = [];
    } , 
  },
});

export const { changeTheme, resetTheme, addTheme } = themeSlice.actions;
export default themeSlice.reducer;