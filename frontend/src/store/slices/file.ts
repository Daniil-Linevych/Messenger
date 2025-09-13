// store/slices/files.ts
import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import type { FileAttachment } from "../../types/file";
import { filesAPI } from "../../api/files";

export const loadMessageFiles = createAsyncThunk<FileAttachment[], number>(
  "message/files", 
  async (messageId, { rejectWithValue }) => {
    try {
      const response = await filesAPI.getMessageFiles(messageId);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data.detail || "Failed to load files!");
    }
  }
);

export const uploadFiles = createAsyncThunk<FileAttachment[], { files: File[]; conversationId: number }>(
  "files/upload",
  async ({ files, conversationId }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });
      formData.append('conversationId', conversationId.toString());

      const response = await filesAPI.uploadFiles(formData);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data.detail || "Failed to upload files!");
    }
  }
);

interface FilesState {
  files: FileAttachment[];
  loading: boolean;
  error?: string;
}

const initialState: FilesState = {
  files: [],
  loading: false,
  error: undefined,
};

const filesSlice = createSlice({
  name: "files",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = undefined;
    }
  },
  extraReducers: (builder) => {
    builder
      // Load files
      .addCase(loadMessageFiles.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadMessageFiles.fulfilled, (state, action: PayloadAction<FileAttachment[]>) => {
        state.loading = false;
        state.files = action.payload;
        state.error = undefined;
      })
      .addCase(loadMessageFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Upload files
      .addCase(uploadFiles.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadFiles.fulfilled, (state, action: PayloadAction<FileAttachment[]>) => {
        state.loading = false;
        // Add the uploaded files to the state if needed
        state.files = [...state.files, ...action.payload];
        state.error = undefined;
      })
      .addCase(uploadFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearError } = filesSlice.actions;
export default filesSlice.reducer;