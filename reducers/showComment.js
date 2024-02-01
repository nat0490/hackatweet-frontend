import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: [],
};

export const showCommentSlice = createSlice({
    name: "showComment",
    initialState,
    reducers: { 
        addShowComment: (state, action)=> {
            state.value.push(action.payload)
        },
        rmvShowComment: (state, action) => {
            state.value = state.value.filter(e => e !== action.payload)
        },
        rmvAllShowComment: (station, action) => {
            state.value= []
        },
    },
});

export const { addShowComment, rmvShowComment, rmvAllShowComment } = showCommentSlice.actions;
export default showCommentSlice.reducer;