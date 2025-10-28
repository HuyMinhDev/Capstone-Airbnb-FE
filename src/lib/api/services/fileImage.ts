import { api } from "../client";
import { API_ENDPOINTS } from "../config";

export interface UploadResponse {
  success: boolean;
  publicId: string;
  fileKey: string;
  bytes: number;
}

export const fileApi = {
  upload: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await api.post<UploadResponse>(
      API_ENDPOINTS.FILE.UPLOAD,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return res.data;
  },

  remove: async (fileKey: string) => {
    console.log(fileKey);
    const res = await api.delete<{ success: boolean }>(
      `${API_ENDPOINTS.FILE.DELETE}/${fileKey}`
    );
    return res.data;
  },
};
