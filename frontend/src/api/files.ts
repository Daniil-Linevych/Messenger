import { api } from "./api";
import type { FileAttachment } from "../types/file";

export const filesAPI = {
  getMessageFiles: (messageId: number) => api.get<FileAttachment[]>(`/files/${messageId}`),
  uploadFiles: (formData: FormData) => api.post<FileAttachment[]>(`/files`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  downloadFile: (fileId: number) => api.get(`/files${fileId}`, {
    responseType:'blob'
  }),
  deleteFile: (fileId: number) => api.delete(`/files/${fileId}`)
};