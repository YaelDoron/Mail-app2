import React, { useRef } from "react";
import "./ImageUploader.css";

const ImageUploader = ({ handleImageUpload, preview, clearImage }) => {
  const fileInputRef = useRef();

  // Handle remove button click: clear preview and reset input
  const onRemoveClick = () => {
    clearImage(); 
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  return (
     <div className="image-uploader">
      {/* Label styled as a custom button to trigger file input */}
      <label htmlFor="file-upload" className="custom-file-upload">  
        Upload Profile Picture
      </label>

      {/* Hidden file input element */}
      <input 
        id="file-upload"
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImageUpload}
        style={{ display: "none" }}
      />      

      {/* Show preview and remove button if an image was selected */}
      {preview && (
        <div className="image-preview-container">
          <img
            src={preview}
            alt="Preview"
            className="image-preview"
          />
          <button
            type="button"
            onClick={onRemoveClick}
            className="remove-button"
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;