import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};

export const hashtagsSlice = createSlice({
  name: "hashtags",
  initialState,
  reducers: {
    addHashtag: (state, action) => {
      state.value.push(action.payload)       
    },
    removehashTag: (state, action) => {
      state.value = [];
    },
  },
});

export const { addHashtag, removehashTag } = hashtagsSlice.actions;
export default hashtagsSlice.reducer;
