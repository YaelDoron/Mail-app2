import React, { useRef } from "react";

const ImageUploader = ({ handleImageUpload, preview, clearImage }) => {
  const fileInputRef = useRef();

  const onRemoveClick = () => {
    clearImage(); 
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  return (
     <div className="image-uploader">
      <label htmlFor="file-upload" className="custom-file-upload">  
        Upload Profile Picture
      </label>
      <input 
        id="file-upload"
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImageUpload}
        style={{ display: "none" }}
      />      

      {preview && (
        <div className="image-preview-container">
          <img
            src={preview}
            alt="Preview"
            className="image-preview"
            style={{
              width: "100px",
              height: "100px",
              objectFit: "cover",
              marginTop: "10px",
              borderRadius: "50%",
              border: "1px solid #ccc",
            }}
          />
          <button
            type="button"
            onClick={onRemoveClick}
            style={{
              marginTop: "8px",
              backgroundColor: "#f44336",
              color: "white",
              border: "none",
              padding: "5px 10px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;