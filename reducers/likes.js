import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};



export const likesSlice = createSlice({
  name: "likes",
  initialState,
  reducers: {
    addLikedTweet: (state, action) => {
      const { user, tweet } = action.payload;
      const userIndex = state.value.findIndex(e => e.user === user);
      if (userIndex !== -1) {
        // L'utilisateur a été trouvé => Nouvelles données avec le tweet en plus
        const updatedLikedTweet = {
          ...state.value[userIndex],
          tweet: [...state.value[userIndex].tweet, tweet],
        };
        //Nouvelles données remplace les anciennes
        return updateStateAtIndex(state, userIndex, updatedLikedTweet);
      } else {
        console.log("Utilisateur non trouvé");
        state.value = [
          ...state.value,
          { user: user, tweet: [tweet], comment: [] },
        ];
      }
    },
    rmvLikedTweet: (state, action) => {
      const { user, tweet } = action.payload;
      const userIndex = state.value.findIndex(e => e.user === user);
      if (userIndex !== -1) {
        // L'utilisateur a été trouvé => Nouvelles données avec le tweet en moins via "filter"
        const updatedLikedTweet = {
          ...state.value[userIndex],
          tweet: state.value[userIndex].tweet.filter(data => data !== tweet),
        };
        return updateStateAtIndex(state, userIndex, updatedLikedTweet);
      } else {
        console.log("Utilisateur non trouvé");
      }
    },
    rmvAlltweet: (state, action) => {
      const user = action.payload;
      const userIndex = state.value.findIndex(e => e.user === user);
      if ( userIndex !== -1) {
        const updatedLikedTweet = {
          ...state.value[userIndex],
          tweet: [],
        };
        return updateStateAtIndex(state, userIndex, updatedLikedTweet);
        // Ne fonctionne pas quand il y a un seul élément dans le tableau
        // state.value = [
        //   ...state.value.splice(userIndex, 1),
        //   updatedLikedTweet,
        // ]
      } else {
        console.log("Utilisateur non trouvé");
      }
    },
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
          { user: user, tweet: [], comment: comment},
        ];
      }
    },
    rmvLikedComment: (state, action) => {
      const { user, comment } = action.payload;
      const userIndex = state.value.findIndex(e => e.user === user);
      if (userIndex !== -1) {
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
    rmvAllTweetAndComment: (state, action) => {
      state.value = []
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

export const { addLikedTweet, rmvLikedTweet, rmvAlltweet, addLikedComment, rmvLikedComment, rmvAllComment, rmvAllTweetAndComment } = likesSlice.actions;
export default likesSlice.reducer;