import React from "react";
import Textarea from "react-textarea-autosize";
import { FaArrowCircleUp } from "react-icons/fa";
import { useInputContext } from "./InputContext";

const InputArea = ({ handleGenerate, handleSendMessage }) => {
    const { inputText, setInputText, analysisResult } = useInputContext();

    return (
        <div className='flex flex-col h-1/3 w-full rounded-lg m-4'>
            <div className='rounded-lg h-5/6 p-4 bg-neutral-900'>
                <Textarea
                    className="w-full bg-transparent text-neutral-200 placeholder-neutral-400"
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
                    <button className='text-green-200 mr-2 text-lg font-bold
                                            bg-neutral-600 px-4 py-1 rounded-md'
                        onClick={handleGenerate}>
                        <p> Generate! </p>
                    </button>
                    <button className='text-white mr-2' onClick={handleSendMessage}>
                        <FaArrowCircleUp className='text-3xl' />
                    </button>
                </div>
            ) : (
                <div className='w-full flex justify-end mt-2'>
                    <button className='text-white mr-2' onClick={handleSendMessage}>
                        <FaArrowCircleUp className='text-3xl' />
                    </button>
                </div>
            )}
        </div>
    );
};

export default InputArea;
