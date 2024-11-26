"use client"; // If you are using Next.js and need client-side rendering

import React from 'react';
import { fetchKnowledgeExtraction } from '@/lib/actions';
import { useState } from 'react';
import { processFileContent } from '@/lib/hooks/file-process';

const SearchComponent = () => {
    // fetchKnowledgeExtraction
    const [selectedFile, setSelectedFile] = useState(null);
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
    };
    const handleFileUpload = async () => {
        if (selectedFile) {
            try {
                // const result = await fetchKnowledgeExtraction(selectedFile);
                const fileContent = await processFileContent(selectedFile);
                console.log(fileContent);
                // const result = await fetchKnowledgeExtraction(fileContent);
                // console.log(result);
            } catch (error) {
                console.error("Error during file upload:", error);
            }
        } else {
            alert("Please select a file first!");
        }
    };

    return (
        <div className="wrapper" style={{
            marginLeft: '18rem',
            height: '50vh', backgroundColor: '#333333',
            alignItems: 'center', justifyContent: 'center',
            marginTop: '20rem',
        }}>
            <input
                type="file"
                onChange={handleFileChange}
                style={{ marginBottom: '1rem' }}
            />
            <button
                onClick={handleFileUpload}
                style={{
                    backgroundColor: '#ffffff',
                    color: '#333333',
                    padding: '0.5rem 1rem',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    border: 'none',
                }}
            >
                Upload File
            </button>
        </div>
    );
};

export default SearchComponent;
