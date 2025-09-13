import {createSlice, createAsyncThunk, type PayloadAction} from "@reduxjs/toolkit"
import type {User} from "../../types/user"
import {conversationAPI} from "../../api/conversations"
import type {Conversation} from "../../types/conversation"

export const loadConversations = createAsyncThunk<Conversation[]>("conversations", async (_, {rejectWithValue}) => {
    try{
        const response = await conversationAPI.loadConversations()
        return response.data;
    } catch(err: any) {
        return rejectWithValue(err.response.data.detail || "Conversation loading failed!")
    }
})

interface ConversationState {
    conversations: Conversation[],
    user: User | null,
    loading: boolean,
    error?: string
}

const initialState: ConversationState = {
    conversations: [],
    user: null,
    loading: false,
    error: undefined,
}

const conversationSlice = createSlice({
    name:"conversation",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
            //load conversations
            .addCase(loadConversations.pending, (state)=>{
                state.loading = true;
            })
            .addCase(loadConversations.fulfilled, (state, action:PayloadAction<Conversation[]>)=>{
                state.loading = false;
                state.conversations = action.payload;
                state.error = undefined;
            })
            .addCase(loadConversations.rejected, (state, action)=>{
                state.loading = false;
                state.error = action.payload as string
            })
           
            
        }
})

export default conversationSlice.reducer;