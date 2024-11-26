"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import * as React from 'react';
import { useDropzone } from 'react-dropzone';
import { FaUpload, FaArrowCircleUp, FaFileImage, FaFilePdf, FaFileWord, FaFileAlt, FaRedo, FaSearch } from 'react-icons/fa';
import Textarea from 'react-textarea-autosize';
import MiniCard from '@/comp/solution/MiniCard';
import { fetchQueryAnalysis, fetchComplete, fetchQuerySolution } from "@/lib/actions";
import CircularProgress from '@mui/material/CircularProgress';
import { LinearProgress } from '@mui/material';
import { customFetch } from '@/lib/actions/customFetch';
import FileUploader from '@/comp/FileUploader';

import PaperSearch from '@/comp/main/PaperSearch';
import SolutionSearch from '@/comp/main/SolutionSearch';

const renderAnalysisResult = (analysisResult, handleQueryAnalysis) => {
  return (
    <div className="p-4 bg-secondary rounded-lg text-sm font-normal">
      <button className="absolute top-15 right-8 cursor-pointer" onClick={handleQueryAnalysis}>
        <FaRedo className="text-gray-400 hover:text-gray-100 text-xl" />
      </button>

      <p>
        <span className="text-gray-500 font-bold">TARGET USER:</span>
        <span className="ml-2"> {analysisResult['Targeted User'] || 'N/A'} </span>
      </p>
      <br />

      <p>
        <span className="text-gray-500 font-bold">USAGE SCENARIO:</span>
        <span className="ml-2"> {analysisResult['Usage Scenario'] || 'N/A'} </span>
      </p>
      <br />

      <p>
        <span className="text-gray-500 font-bold">REQUIREMENTS:</span>
        <span className="ml-2">
          {Array.isArray(analysisResult['Requirement'])
            ? analysisResult['Requirement'].join(', ')
            : 'N/A'}
        </span>
      </p>
    </div>
  );
};

const GenerateSolution = () => {
  const [id, setId] = useState('');
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState('');
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    const storedId = localStorage.getItem("id");
    if (storedId) {
      setId(storedId);
    }
  }, []);

  const handleSendMessage = () => {
    console.log(inputText);
    setMessages('');
    if (inputText.trim()) {
      setMessages(inputText);
      handleQueryAnalysis();
    }
  };

  // ---------------------------------------------------------------------------------- //

  const renderFileIcon = (file: File) => {
    const fileType = file.type;
    if (fileType.startsWith("image/")) return <FaFileImage className="text-blue-500 text-2xl" />;
    if (fileType === "application/pdf") return <FaFilePdf className="text-red-500 text-2xl" />;
    if (fileType.includes("word")) return <FaFileWord className="text-blue-700 text-2xl" />;
    return <FaFileAlt className="text-gray-500 text-2xl" />;
  };

  // Handle file drop
  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    onDrop: (acceptedFiles) => {
      // setFiles(['']);
      if (acceptedFiles.length > 0) {
        setFiles([acceptedFiles[0]]);
      }
    }
  });

  // ---------------------------------------------------------------------------------- //

  const [analysisResult, setAnalysisResult] = useState('');
  const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);
  const callQueryAnalysis = async (inputText, files, setAnalysisResult, setIsAnalysisLoading) => {
    try {
      setIsAnalysisLoading(true);
      const analysisResult = await fetchQueryAnalysis(inputText, files[0]);
      const result = JSON.parse(analysisResult);
      console.log('Analysis result:', result);
      setAnalysisResult(result);
    } catch (error) {
      console.error('Error fetching analysis:', error);
    } finally {
      setIsAnalysisLoading(false);
    }
  };

  const handleQueryAnalysis = () => {
    callQueryAnalysis(inputText, files, setAnalysisResult, setIsAnalysisLoading);
  };

  // ---------------------------------------------------------------------------------- //

  const [taskId, setTaskId] = useState(null);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("Initializing...");
  const [isCompleteLoading, setIsCompleteLoading] = useState(false);
  const [completeResult, setCompleteResult] = useState(null);

  async function callStepApi(url, data) {
    const apiUrl = process.env.API_URL;
    // const apiUrl = "http://120.55.193.195:5001";
    const token = localStorage.getItem("token");
    try {
      const headers = {
        "Content-Type": "application/json",
        ...(token && { "Authorization": `Bearer ${token}` }),
      };
      const body = JSON.stringify(data);
      const response = await fetch(`${apiUrl}${url}`, { method: 'POST', headers: headers, body: body, });
      const result = await response.json();

      console.log(result);
      setProgress(result.progress);
      setStatusMessage(result.status);

      return result
    } catch (error) {
      console.error(`Error in ${url}:`, error);
      throw error;
    }
  }

  async function pollTaskStatus(taskId) {
    const apiUrl = `http://120.55.193.195:5001/api/complete/status/${taskId}`;

    const interval = setInterval(async () => {
      try {
        const response = await fetch(apiUrl, { method: 'GET' });
        const result = await response.json();

        setProgress(result.progress);
        setStatusMessage(result.status);
        console.log(result);
        console.log(result.status);

        if (result.status === "completed") {
          clearInterval(interval);  // 停止轮询
          // setCompleteResult(result);
          setIsCompleteLoading(false);
          // console.log("Task completed:", result);
        } else if (result.status === "error" || result.status === "unknown") {
          clearInterval(interval);  // 停止轮询
          setStatusMessage("Task failed");
          console.error("Task error:", result);
          setIsCompleteLoading(false);
        }
      } catch (error) {
        console.error("Error while polling task status:", error);
        clearInterval(interval);
        setIsCompleteLoading(false);
      }
    }, 2000); // 每2秒轮询一次
  }

  const handleGenerate = async () => {
    setIsCompleteLoading(true);
    setStatusMessage("Starting task...");

    try {
      const initResponse = await callStepApi('/api/complete/initialize', { data: JSON.stringify(analysisResult) });
      setTaskId(initResponse.task_id);
      console.log("init:", initResponse);

      const mode = selectedMode;
      if (mode == "solution") {
        await callStepApi('/api/complete/example', { task_id: initResponse.task_id, data: JSON.stringify(selectedIds) });
      }
      else if (mode == "paper") {
        await callStepApi('/api/complete/paper', { task_id: initResponse.task_id, data: JSON.stringify(selectedIds) });
      }
      else {
        await callStepApi('/api/complete/rag', { task_id: initResponse.task_id });
      }

      await callStepApi('/api/complete/domain', { task_id: initResponse.task_id });
      await callStepApi('/api/complete/interdisciplinary', { task_id: initResponse.task_id });
      await callStepApi('/api/complete/evaluation', { task_id: initResponse.task_id });
      await callStepApi('/api/complete/drawing', { task_id: initResponse.task_id });

      const result = await callStepApi('/api/complete/final', { task_id: initResponse.task_id });
      console.log('Complete result:', result);
      setCompleteResult(result);
    } catch (error) {
      console.error("Error during task generation:", error);
      setTaskId('');
      setIsCompleteLoading(false);
    } finally {
      setTaskId('');
      setProgress(0);
      setIsCompleteLoading(false);
    }
  };

  const handleRegenerate = async () => {
    setIsCompleteLoading(true);
    setStatusMessage("Starting task...");

    try {
      const solution_ids = JSON.stringify(
        completeResult['solutions'].map((solution) => solution.id)
      );
      console.log(solution_ids);

      const initResponse = await callStepApi('/api/complete/initialize', { data: JSON.stringify(analysisResult) });
      setTaskId(initResponse.task_id);
      console.log("init:", initResponse);

      await callStepApi('/api/complete/example', { task_id: initResponse.task_id, data: solution_ids });
      console.log("Example step completed");
      await callStepApi('/api/complete/interdisciplinary', { task_id: initResponse.task_id });
      await callStepApi('/api/complete/evaluation', { task_id: initResponse.task_id });
      await callStepApi('/api/complete/drawing', { task_id: initResponse.task_id });

      const result = await callStepApi('/api/complete/final', { task_id: initResponse.task_id });
      console.log('Complete result:', result);
      setCompleteResult(result);
    } catch (error) {
      console.error("Error during task generation:", error);
      setTaskId('');
      setIsCompleteLoading(false);
    } finally {
      setTaskId('');
      setProgress(0);
      setIsCompleteLoading(false);
    }
  };

  // ---------------------------------------------------------------------------------- //

  const [selectedMode, setSelectedMode] = useState('chat');
  const [selectedIds, setSelectedIds] = useState([]);

  const handleIDSelection = (ids) => {
    setSelectedIds(ids);
    console.log(selectedIds);
  };

  const handleModeChange = (event) => {
    const mode = event.target.value;
    setSelectedMode(mode);
    setSelectedIds([]);
  };

  // ---------------------------------------------------------------------------------- //

  return (
    <div className='flex justify-center bg-primary text-text-primary min-h-full ml-48'>
      <div className='flex w-[85rem] min-h-screen flex-col items-center justify-center'>
        <div className='flex w-full h-[45rem] bg-secondary rounded-2xl'>

          <div className='relative w-1/3 ml-6 mt-6 mb-6 rounded-lg bg-primary'>
            <div className='flex justify-between items-center'>
              <div className='text-text-secondary text-2xl font-semibold ml-5 mt-2'>Input</div>

              <select
                className='mr-5 mt-2 p-2 rounded-md bg-secondary text-text-secondary'
                value={selectedMode}
                onChange={handleModeChange}
              >
                <option value="chat">Chat</option>
                <option value="solution">Solution</option>
                <option value="paper">Paper</option>
              </select>
            </div>

            <div className='flex flex-col items-center mt-2 ml-5 mr-5 h-[92.5%] rounded-lg'>
              <div className='flex w-full h-1/3 items-center justify-center overflow-auto'>
                <div className='flex h-full w-full items-center justify-center flex-col rounded-lg 
                                    text-xl font-semibold text-text-placeholder gap-4'>
                  <>
                    {isAnalysisLoading ? (
                      <div className="flex justify-center items-center">
                        <CircularProgress />
                      </div>
                    ) : analysisResult ? (
                      renderAnalysisResult(analysisResult, handleQueryAnalysis)
                    ) : (
                      <div></div>
                    )}
                  </>
                </div>
              </div>
              <div {...getRootProps()}
                className='flex flex-col w-full items-center justify-center
                    rounded-lg text-lg mt-2 border-2 border-dashed border-neutral-600 
                    p-5 bg-secondary hover:bg-secondary transition-all duration-300'
                style={{ height: '12rem' }}
              >
                <input {...getInputProps()} />
                {files.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center text-text-placeholder">
                    <p className="mb-2 text-base">Drag & drop files here, or click to select files</p>
                    <p className="text-sm text-text-secondary font-bold">(Only Support .txt)</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center w-full">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-center w-full h-full text-text-secondary">
                        {renderFileIcon(file)}
                        <span className="ml-3 text-2xl font-semibold truncate">{file.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className='flex flex-col h-1/3 w-full rounded-lg m-4'>
                <div className='rounded-lg h-5/6 p-4 bg-secondary'>
                  <Textarea
                    className="w-full bg-transparent text-text-primary placeholder-text-placeholder"
                    placeholder="Please type your question here..."
                    minRows={6}
                    maxRows={6}
                    spellCheck={false}
                    autoComplete="off"
                    autoCorrect="off"
                    onChange={(e) => setInputText(e.target.value)}
                  />
                </div>

                {analysisResult ? (
                  <div className='w-full flex justify-between mt-2'>
                    <button className='text-text-secondary mr-2 text-lg font-bold
                                        bg-secondary px-4 py-1 rounded-md'
                      onClick={handleGenerate}>
                      <p>Generate!</p>
                    </button>
                    <button className='text-text-primary mr-2' onClick={handleSendMessage}>
                      <FaArrowCircleUp className='text-3xl' />
                    </button>
                  </div>
                ) : (
                  <div className='w-full flex justify-end mt-2'>
                    <button className='text-text-primary mr-2' onClick={handleSendMessage}>
                      <FaArrowCircleUp className='text-3xl' />
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>

          <div className='relative w-2/3 m-6 rounded-lg bg-primary overflow-auto'>
            <div className="flex w-full h-full">
              {isCompleteLoading ? (
                <div className="flex flex-col w-full h-full justify-center items-center">
                  <div style={{ width: '80%', marginTop: '20px' }}>
                    <LinearProgress variant="determinate" value={progress} />
                    <p>{progress}%</p>
                  </div>
                </div>
              ) : completeResult ? (
                <div className="flex flex-col text-sm font-normal p-4 gap-4">
                  <div className="flex justify-end">
                    <button
                      className="text-text-secondary hover:text-text-primary text-xl cursor-pointer"
                      onClick={handleRegenerate}
                    >
                      <FaRedo />
                    </button>
                  </div>

                  <div className="bg-primary p-4 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold text-text-primary">
                      {completeResult['title']}
                    </h2>
                  </div>

                  <div className="bg-secondary p-4 rounded-lg shadow-md overflow-auto">
                    <p className="text-md text-text-secondary">
                      {completeResult['desc']}
                    </p>
                  </div>

                  <div className="text-text-primary text-4xl font-bold
                              flex w-full h-auto items-center justify-center
                              gap-1 flex-wrap overflow-auto">

                    {completeResult['solutions']?.length ? (
                      completeResult['solutions'].map((solution, index) => (
                        <div key={index}>
                          <MiniCard
                            key={index}
                            content={solution}
                            index={index}
                            isLiked={false}
                          />
                        </div>
                      ))
                    ) : (
                      <p className="text-lg text-text-placeholder">No solutions available.</p>
                    )}

                  </div>
                </div>
              ) : (
                <div className="flex w-full h-full justify-center items-center">
                  {selectedMode === 'solution' && (
                    <SolutionSearch onSelectionChange={handleIDSelection} />
                  )}

                  {selectedMode === 'paper' && (
                    <PaperSearch onSelectionChange={handleIDSelection} />
                  )}

                  {(selectedMode !== 'solution' && selectedMode !== 'paper') && (
                    <p className='font-bold text-4xl'>No result available yet.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
};

export default GenerateSolution;
