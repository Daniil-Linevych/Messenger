import {createSlice, createAsyncThunk, type PayloadAction} from "@reduxjs/toolkit"
import type {User} from "../../types/user"
import type { AuthData } from "../../types/auth"
import {authAPI} from "../../api/auth"
import {handleError} from "../../utils/error"


export const login = createAsyncThunk<User, AuthData>("login", async (data, {rejectWithValue}) => {
    try{
        const response = await authAPI.login(data)
        const {access_token} = response.data;

        localStorage.setItem("access_token", access_token)

        const userResponse = await authAPI.get_current_user()
        return userResponse.data 
    } catch(err: any) {
        return rejectWithValue(handleError(err))
    }
})

export const register = createAsyncThunk<User, AuthData>("register", async (data, {rejectWithValue}) => {
    try{
        const response = await authAPI.register(data);
        return response.data;

    } catch (err: any){
        return rejectWithValue(handleError(err))
    }
})

export const get_current_user = createAsyncThunk<User>("get_user", async (_, {rejectWithValue})=>{
    try{
        const response = await authAPI.get_current_user()
        return response.data
    } catch (err: any){
        localStorage.removeItem("access_token");
        return rejectWithValue(handleError(err))
    }
})

export const logout = createAsyncThunk<void>("auth/logout", async () => {
    try {
        await authAPI.logout();
    } catch {}
    localStorage.removeItem("access_token");
});

interface AuthState {
    user: User | null,
    loading: boolean,
    isAuthenticated: boolean,
    error?: string
}

const initialState: AuthState = {
    user: null,
    loading: false,
    isAuthenticated: false,
    error: undefined,
}

const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        clearError: (state) => {
            state.error = undefined;
        }
    },
    extraReducers:(builder)=>{
        builder
            //login
            .addCase(login.pending, (state)=>{
                state.loading = true;
                state.error = undefined; 
            })
            .addCase(login.fulfilled, (state, action:PayloadAction<User>)=>{
                state.loading = false;
                state.user = action.payload
                state.isAuthenticated = true;
                state.error = undefined;
            })
            .addCase(login.rejected, (state, action)=>{
                state.loading = false;
                state.error = action.payload as string
            })
            //register
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = undefined;
            })
            .addCase(register.fulfilled, (state, action: PayloadAction<User>) => {
                state.loading = false;
                state.user = action.payload;
                state.error = undefined
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            //get current user
            .addCase(get_current_user.pending, (state) => {
                state.loading = true;
                state.error = undefined;
            })
            .addCase(get_current_user.fulfilled, (state, action: PayloadAction<User>) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(get_current_user.rejected, (state, action) => {
                state.user = null;
                state.isAuthenticated = false;
                state.loading = false;
                state.error = action.payload as string;
            })
            //logout
            .addCase(logout.fulfilled, (state) => {
                state.loading = false;
                state.user = null;
                state.isAuthenticated = false;
            })
            
        }
})

export const { clearError } = authSlice.actions;
export default authSlice.reducer;