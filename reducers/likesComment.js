import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};

export const likesCommentSlice = createSlice({
  name: "likes",
  initialState,
  reducers: {
    // addUser: (state, action) => {
    //   state.value = [ ...state.value, { user: action.payload, comment: [] }]
    // },
    // addLikeCom : (state, action) => {
    //   const { user, comment } = action.payload;
    //   const userIndex = state.value.findIndex(e => e.user === user);

    // },
    addLikedComment: (state, action) => {
      const { user, comment } = action.payload;
      const userIndex = state.value.findIndex(e => e.user === user);
      if (userIndex !== -1) {
        const updatedLikedComment = {
          ...state.value[userIndex],
          comment: [ ...state.value[userIndex].comment, comment],
        };
        return updateStateAtIndex(state, userIndex, updatedLikedComment);
      } else {
        console.log("utilisateur non trouvé");
        state.value = [
          ...state.value,
          { user: user, comment: [comment]},
        ];
      }
    },
    rmvLikedComment: (state, action) => {
      const { user, comment } = action.payload;
      const userIndex = state.value.findIndex(e => e.user === user);
      // console.log(userIndex);
      if (userIndex !== -1) {
        // console.log(state.value);
        const updatedLikedComment = {
          ...state.value[userIndex],
          comment : state.value[userIndex].comment.filter(com => com !== comment),
        };
        return updateStateAtIndex(state, userIndex, updatedLikedComment);
      }
    },
    rmvAllComment: (state, action) => {
      const user = action.payload;
      const userIndex = state.value.findIndex(e => e.user === user);
      if ( userIndex !== -1) {
        const updatedLikedComment = {
          ...state.value[userIndex],
          comment: [],
        };
        return updateStateAtIndex(state, userIndex, updatedLikedComment);
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

export const { addLikedComment, rmvLikedComment, rmvAllComment } = likesCommentSlice.actions;
export default likesCommentSlice.reducer;