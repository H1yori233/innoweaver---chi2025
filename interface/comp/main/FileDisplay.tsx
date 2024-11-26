import { useFileContext } from "./FileContext";

const FileDisplay = () => {
    const { uploadedFiles, clearFiles } = useFileContext();

    return (
        <div className="p-4 bg-neutral-800 rounded-lg">
            <h3 className="text-lg text-white">Uploaded Files</h3>
            {uploadedFiles.length > 0 ? (
                <ul className="list-disc pl-5 text-gray-300">
                    {uploadedFiles.map((file, index) => (
                        <li key={index}>{file.name}</li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500">No files uploaded yet.</p>
            )}
            <button
                onClick={clearFiles}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg"
            >
                Clear Files
            </button>
        </div>
    );
};

export default FileDisplay;
