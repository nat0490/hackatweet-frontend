import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    tweet: [],
    comment: []
  },
};

export const likesSlice = createSlice({
  name: "likes",
  initialState,
  reducers: {
    addLikedTweet: (state, action) => {
        state.value.tweet.push(action.payload);
    },
    rmvLikedTweet: (state, action) => {
        state.value.tweet = state.value.tweet.filter((data) => data !== action.payload);
    },
    rmvAlltweet: (state, action) => {
        state.value.tweet = [];
    },
    addLikedComment: (state, action) => {
        state.value.comment.push(action.payload);
    },
    rmvLikedComment: (state, action) => {
        state.value.comment = state.value.comment.filter((data) => data !== action.payload);
    },
    rmvAllComment: (state, action) => {
        state.value.comment = [];
    },
  },
});

export const { addLikedTweet, rmvLikedTweet, rmvAlltweet, addLikedComment, rmvLikedComment, rmvAllComment } = likesSlice.actions;
export default likesSlice.reducer;