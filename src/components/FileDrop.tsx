import React, { useState, useCallback } from 'react';
import { createWorker, PSM } from 'tesseract.js';

interface FileDropProps {
  onTextExtracted: (text: string) => void;
}

const FileDrop: React.FC<FileDropProps> = ({ onTextExtracted }) => {
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        processFile(file);
        e.dataTransfer.clearData();
      }
    },
    [onTextExtracted]
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        processFile(file);
      }
    },
    [onTextExtracted]
  );
  const processFile = (file: File) => {
    setLoading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      if (event.target && event.target.result) {
        const imageUrl = event.target.result.toString();
        try {
          const worker = await createWorker(['eng', 'rus', 'ukr']);
          await worker.setParameters({
            tessedit_pageseg_mode: PSM.AUTO_OSD,
          });
          const { data: { text } } = await worker.recognize(imageUrl);
          onTextExtracted(text);
          await worker.terminate();
        } catch (error) {
          console.error('Error during text recognition:', error);
        }
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectFileClick = () => {
    const fileInput = document.querySelector<HTMLInputElement>('input[type="file"]');
    if (fileInput) {
      fileInput.click();
    }
  };

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{
        border: dragging ? '2px dashed #000' : '2px dashed #ccc',
        padding: '20px',
        borderRadius: '4px',
        textAlign: 'center',
        transition: 'border-color 0.3s',
        position: 'relative'
      }}
    >
      {loading ? 'Processing...' : (dragging ? 'Drop the files here...' : 'Drag & drop files here, or click to select files')}
      <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileInputChange} />
      <button style={{display: loading?"none":""}} onClick={handleSelectFileClick}>Select File</button>
    </div>
  );
};

export default FileDrop;