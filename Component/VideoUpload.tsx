import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const VideoUploader: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const uploadRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const allowedTypes = ['video/mp4', 'video/mov'];
      const maxFileSize = 50 * 1024 * 1024; // 50 MB
      if (allowedTypes.includes(file.type)) {
        if (file.size <= maxFileSize) {
          setSelectedFile(file);
          setVideoUrl(URL.createObjectURL(file));
          setErrorMessage(null);
        } else {
          setErrorMessage('File size exceeds the maximum limit (50 MB).');
        }
      } else {
        setErrorMessage('Please select a valid video file (MP4 or MOV).');
      }
    }
  };

  const resetFile = () => {
    setSelectedFile(null);
    setVideoUrl(null);
    setUploadProgress(0);
    setErrorMessage(null);
    setUploading(false);
    if (uploadRef.current) {
      uploadRef.current.value = ''; // Reset file input
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setErrorMessage(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('https://api.bunny.net/videolibrary/upload', formData, {
        headers: {
          'AccessKey': 'YOUR_BUNNY_NET_API_KEY', // Replace with your Bunny.net API key
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          setUploadProgress(progress);
        },
      });

      console.log('Upload successful:', response.data);
      resetFile();
    } catch (error) {
      console.error('Upload failed:', error.message);
      setErrorMessage('Upload failed. Please try again.');
      setUploadProgress(0);
      setUploading(false);
    }
  };

  return (
    <div className="container">
      <div className="center-content">
        {!selectedFile ? (
          <div className="uploader-content">
            <label className="file-input-label">
              <input
                ref={uploadRef}
                type="file"
                accept="video/mp4,video/mov"
                onChange={handleFileChange}
                className="file-input"
              />
              <FontAwesomeIcon icon={faUpload} className="upload-icon" />
              Select Video
            </label>
          </div>
        ) : (
          <div className="video-container">
            <video controls autoPlay className="uploaded-video">
              <source src={videoUrl || undefined} type={selectedFile.type} />
              Your browser does not support the video tag.
            </video>
            <div className="video-info">
              <p>Selected File: {selectedFile.name}</p>
            </div>
          </div>
        )}
      </div>
      {errorMessage && (
        <div className="error-container">
          <p className="error-message">{errorMessage}</p>
        </div>
      )}
        {selectedFile && (
  <div className="actions-container">
    {!uploading ? (
      <div className="button-group">
        <button onClick={handleUpload} className="upload-button">
          Upload
        </button>
        <button onClick={resetFile} className="cancel-button">
          Cancel
        </button>
      </div>
    ) : (
      <div className="progress-container">
        <div className="progress-text">Uploading... {uploadProgress}%</div>
        <div className="progress-bar bg-blue-500" style={{ width: `${uploadProgress}%` }}></div>
      </div>
    )}
  </div>
)}

    </div>
  );
};

export default VideoUploader;
