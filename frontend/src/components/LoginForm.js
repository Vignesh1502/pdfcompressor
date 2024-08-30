import React, { useState } from 'react';


const PdfUploadForm = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [compressionDetails, setCompressionDetails] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type !== 'application/pdf') {
      alert('Please upload a PDF file.');
      setSelectedFile(null);
      e.target.value = null;
    } else {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      alert('Please select a PDF file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('http://127.0.0.1:8000/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const downloadUrl = `http://127.0.0.1:8000/download/${encodeURIComponent(data.filename)}`;
        
        // Calculate compression ratio
        const originalSize = data.original_size;
        const compressedSize = data.compressed_size;
        const compressionRatio = ((originalSize - compressedSize) / originalSize * 100).toFixed(2);

        setCompressionDetails({
          originalSize: (originalSize / 1024).toFixed(2), // convert to KB
          compressedSize: (compressedSize / 1024).toFixed(2), // convert to KB
          compressionRatio,
          downloadUrl,
        });

      } else {
        alert('File upload failed.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="pdf-upload-form">
      <h2>Upload Your PDF File</h2>
      <form onSubmit={handleSubmit} className="upload-form">
        <div className="form-group">
          <label htmlFor="file" className="file-label">Choose a PDF file:</label>
          <input
            type="file"
            id="file"
            name="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="file-input"
          />
        </div>
        <button type="submit" id="upload-btn" className="upload-button">Upload</button>
      </form>

      {compressionDetails && (
        <div className="compression-details">
          <h3>Compression Details For the file</h3>
          <p>Original Size: {compressionDetails.originalSize} KB</p>
          <p>Compressed Size: {compressionDetails.compressedSize} KB</p>
          <p>Compression Ratio: {compressionDetails.compressionRatio}%</p>
          <a href={compressionDetails.downloadUrl} className="download-link" download>Download Compressed File</a>
        </div>
      )}
    </div>
  );
};

export default PdfUploadForm;
