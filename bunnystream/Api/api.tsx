import axios, { AxiosResponse } from 'axios';

// Define types for your API response
export interface UploadResponse {
  success: boolean;
  message: string;
  // Add more properties as per your API response
}

// Function to hit the API
export const uploadVideo = async (videoData: FormData): Promise<UploadResponse> => {
  try {
    const response: AxiosResponse<UploadResponse> = await axios.post<UploadResponse>(
      'https://video.bunnycdn.com/tusupload',
      videoData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          // You can add other headers if required
        },
      }
    );

    // Assuming the API returns JSON with success and message fields
    return response.data;
  } catch (error) {
    // Handle error
    console.error('Error uploading video:', error);
    throw new Error('Failed to upload video');
  }
};
