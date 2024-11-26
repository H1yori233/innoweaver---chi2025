import React, { createContext, useState, useContext } from "react";

const InputContext = createContext();

export const InputProvider = ({ children }) => {
  const [inputText, setInputText] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);

  const clearInput = () => setInputText("");

  return (
    <InputContext.Provider
      value={{ inputText, setInputText, analysisResult, setAnalysisResult, clearInput }}
    >
      {children}
    </InputContext.Provider>
  );
};

export const useInputContext = () => useContext(InputContext);
