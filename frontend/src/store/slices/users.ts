import {createSlice, createAsyncThunk, type PayloadAction} from "@reduxjs/toolkit"
import type {User} from "../../types/user"
import {usersAPI} from "../../api/users"

export const getUsers = createAsyncThunk<User[]>("users", async (_, {rejectWithValue}) => {
    try{
        const response = await usersAPI.getUsers()
        return response.data;
    } catch(err: any) {
        return rejectWithValue(err.response.data.detail || "Users loading failed!")
    }
})

export const getUsersByUsername = createAsyncThunk<User[], string>("users/name", async (username:string, {rejectWithValue}) => {
    try{
        const response = await usersAPI.getUsersByUsername(username)
        return response.data;
    } catch(err: any) {
        return rejectWithValue(err.response.data.detail || "Users loading failed!")
    }
})

interface UsersState {
    users: User[],
    loading: boolean,
    error?: string
}

const initialState: UsersState = {
    users: [],
    loading: false,
    error: undefined,
}

const conversationSlice = createSlice({
    name:"users",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
            //get users
            .addCase(getUsers.pending, (state)=>{
                state.loading = true;
            })
            .addCase(getUsers.fulfilled, (state, action:PayloadAction<User[]>)=>{
                state.loading = false;
                state.users = action.payload;
                state.error = undefined;
            })
            .addCase(getUsers.rejected, (state, action)=>{
                state.loading = false;
                state.error = action.payload as string
            })
            //get users by username
            .addCase(getUsersByUsername.pending, (state)=>{
                state.loading = true;
            })
            .addCase(getUsersByUsername.fulfilled, (state, action:PayloadAction<User[]>)=>{
                state.loading = false;
                state.users = action.payload;
                state.error = undefined;
            })
            .addCase(getUsersByUsername.rejected, (state, action)=>{
                state.loading = false;
                state.error = action.payload as string
            })
           
            
        }
})

export default conversationSlice.reducer;