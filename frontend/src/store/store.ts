import {} from "react-redux"
import {configureStore} from "@reduxjs/toolkit"
import authReducer from "./slices/auth"
import conversatioReducer from "./slices/conversation"
import messageReducer from "./slices/message"
import usersReducer from "./slices/users"
import filesReducer from "./slices/file"

export const store = configureStore({
    reducer:{
        auth: authReducer,
        conversations: conversatioReducer,
        messages: messageReducer,
        users: usersReducer,
        files: filesReducer
    }
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;