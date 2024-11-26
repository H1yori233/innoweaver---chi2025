import React, { createContext, useState, useContext } from "react";

const FileContext = createContext();
export const FileProvider = ({ children }) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const addFiles = (files) => {
    setUploadedFiles(files);
  };

  const clearFiles = () => {
    setUploadedFiles([]);
  };

  return (
    <FileContext.Provider value={{ uploadedFiles, addFiles, clearFiles }}>
      {children}
    </FileContext.Provider>
  );
};

export const useFileContext = () => useContext(FileContext);
