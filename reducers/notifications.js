import { createSlice } from "@reduxjs/toolkit";;

const initialState = {
    value: {
        notification: [],
        nonLu: 0,
    },
};

export const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        addNotification: (state, action) => {
            state.value.notification = action.payload;
            const toRead = action.payload.filter(e => e.isRead === false);
            state.value.nonLu = toRead.length;
        },
        updateNotification: (state, action) => {
            state.value.notification = state.value.notification
                .filter(e => e._id !== action.payload._id)
                .concat(action.payload);
            state.value.notification.push(action.payload);
        },
        rmvNotification: (state, action )=> {
            state.value.notification = state.value.notification.filter(e => {
                e._id !== action.payload._id
            })
        },
        rmvAllNotification: (state,action) => {
            state.value = {
                notification: [],
                nonLu: 0,
            };
        },
    },
});

export const { addNotification, rmvNotification, rmvAllNotification, updateNotification} = notificationSlice.actions;
export default notificationSlice.reducer;