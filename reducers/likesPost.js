import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};

export const likesPostSlice = createSlice({
  name: "likes",
  initialState,
  reducers: {
    addLikedPost: (state, action) => {
      const { user, post } = action.payload;
      const userIndex = state.value.findIndex(e => e.user === user);
      if (userIndex !== -1) {
        const updatedLikePost = {
          ...state.value[userIndex],
          post: [ ...state.value[userIndex].post, post],
        };
        return updateStateAtIndex(state, userIndex, updatedLikePost);
      } else {
        console.log("utilisateur non trouvé");
        state.value = [
          ...state.value,
          { user: user, post: [post]},
        ];
      }
    },
    rmvLikedPost: (state, action) => {
      const { user, post } = action.payload;
      const userIndex = state.value.findIndex(e => e.user === user);
      // console.log(userIndex);
      if (userIndex !== -1) {
        // console.log(state.value);
        const updatedLikePost = {
          ...state.value[userIndex],
          post : state.value[userIndex].post.filter(com => com !== post),
        };
        return updateStateAtIndex(state, userIndex, updatedLikePost);
      }
    },
    rmvAllPost: (state, action) => {
      const user = action.payload;
      const userIndex = state.value.findIndex(e => e.user === user);
      if ( userIndex !== -1) {
        const updatedLikePost = {
          ...state.value[userIndex],
          post: [],
        };
        return updateStateAtIndex(state, userIndex, updatedLikePost);
      } else {
        console.log("Utilisateur non trouvé");
      }
    },
   },
});


const updateStateAtIndex = (state, index, updatedValue) => ({
  ...state,
  value: [
    ...state.value.slice(0, index),
    updatedValue,
    ...state.value.slice(index + 1),
  ],
});


    // ORIGINAL: présent dans chaque reducer avant
        // state.value = [
        //   ...state.value.slice(0, userIndex),
        //   updatedLikedTweet,
        //   ...state.value.slice(userIndex + 1),
        // ];

export const { addLikedPost, rmvLikedPost, rmvAllPost } = likesPostSlice.actions;
export default likesPostSlice.reducer;