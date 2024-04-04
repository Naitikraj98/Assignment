import React, { useState } from 'react';
import { uploadVideo, UploadResponse } from '../Api/api'; // Adjust the path

const Upload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      console.error('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('video', file);

    try {
      const response: UploadResponse = await uploadVideo(formData);
      console.log('Upload response:', response);
      // Handle success, show message, update UI, etc.
    } catch (error) {
      // Handle error, show error message, etc.
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default Upload;
