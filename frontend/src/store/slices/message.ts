import {createSlice, createAsyncThunk, type PayloadAction} from "@reduxjs/toolkit"
import type {Message} from "../../types/message"
import {conversationAPI} from "../../api/conversations"

export const loadMessages = createAsyncThunk<Message[], number>("conversation/user", async (userId, {rejectWithValue}) => {
    try{
        const response = await conversationAPI.loadConversationMessages(userId);
        return response.data;

    } catch (err: any){
        return rejectWithValue(err.response.data.detail || "Registration failed!")
    }
})

interface MessagesState {
    messages: Message[],
    loading: boolean,
    error?: string
}

const initialState: MessagesState = {
    messages: [],
    loading: false,
    error: undefined,
}

const messageSlice = createSlice({
    name:"conversation",
    initialState,
    reducers:{
        addMessage: (state, action: PayloadAction<Message>) => {
            state.messages.push(action.payload);
        },
        updateMessage: (state, action: PayloadAction<Message>) => {
            const index = state.messages.findIndex((m) => m.id === action.payload.id);
            if (index !== -1) {
                state.messages[index] = action.payload;
            }
        },
        deleteMessage: (state, action: PayloadAction<number>) => {
            state.messages = state.messages.filter((m) => m.id !== action.payload);
        },
        clearMessages: (state) => {
            state.messages = [];
        },
    },
    extraReducers:(builder)=>{
        builder
            //load messages
            .addCase(loadMessages.pending, (state)=>{
                state.loading = true;
            })
            .addCase(loadMessages.fulfilled, (state, action:PayloadAction<Message[]>)=>{
                state.loading = false;
                state.messages = action.payload;
                state.error = undefined;
            })
            .addCase(loadMessages.rejected, (state, action)=>{
                state.loading = false;
                state.error = action.payload as string
            })
           
            
        }
})

export const { addMessage, updateMessage, deleteMessage, clearMessages } = messageSlice.actions;
export default messageSlice.reducer;
