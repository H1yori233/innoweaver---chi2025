import { useDropzone } from "react-dropzone";
import { useFileContext } from "./FileContext";
import { FaFileImage, FaFilePdf, FaFileWord, FaFileAlt } from "react-icons/fa";

const renderFileIcon = (file) => {
    if (file.type.startsWith("image/")) return <FaFileImage className="text-blue-500 text-2xl" />;
    if (file.type === "application/pdf") return <FaFilePdf className="text-red-500 text-2xl" />;
    if (file.type.includes("word")) return <FaFileWord className="text-blue-700 text-2xl" />;
    return <FaFileAlt className="text-gray-500 text-2xl" />;
};

const FileUpload = () => {
    const { uploadedFiles, addFiles } = useFileContext();

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: (files) => {
            addFiles([...uploadedFiles, ...files]); // 更新全局文件状态
        },
    });

    return (
        <div
            {...getRootProps()}
            className="flex flex-col w-full items-center justify-center
                        rounded-lg text-lg mt-2 border-2 border-dashed border-neutral-600 
                        p-5 bg-neutral-800 hover:bg-neutral-700 transition-all duration-300"
            style={{ height: "12rem" }}
        >
            <input {...getInputProps()} />
            {uploadedFiles.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center text-gray-400">
                    <p className="mb-2 text-base">Drag & drop files here, or click to select files</p>
                    <p className="text-sm text-gray-500 font-bold">(Only Support .txt)</p>
                </div>
            ) : (
                <div className="flex flex-col items-center w-full gap-2">
                    {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center w-full text-gray-300">
                            {renderFileIcon(file)}
                            <span className="ml-3 text-lg font-medium truncate">{file.name}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FileUpload;
