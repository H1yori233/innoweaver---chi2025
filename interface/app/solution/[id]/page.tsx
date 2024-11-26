"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { MeiliSearch } from 'meilisearch';
import { fetchQuerySolution, fetchQueryLikedSolutions, fetchLikeSolution } from '@/lib/actions';
import '@/comp/solution/CardPage.css';
import JsonViewer from '@/comp/paper/JsonViewer';
import { FaHeart } from 'react-icons/fa';

const SolutionCard = () => {
    // const apiUrl = process.env.API_URL.replace(':5000', ':7700/');
    const apiUrl = '120.55.193.195:7700/';
    const { id } = useParams();
    const [solution, setSolution] = useState([]);
    const [citedPapersDetails, setCitedPapersDetails] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const client = useMemo(() => new MeiliSearch({ host: apiUrl }), [apiUrl]);
    const handleQuerySolution = useCallback(async () => {
        const fetchPaperDetails = async (paperId) => {
            try {
                const index = client.index('paper_id');
                const searchResults = await index.search(paperId, {
                    limit: 1,
                });

                if (searchResults.hits.length > 0) {
                    return searchResults.hits[0];
                } else {
                    throw new Error('Paper not found');
                }
            } catch (error) {
                console.error('Error fetching paper details:', error);
                throw error;
            }
        };

        try {
            setLoading(true);
            const result = await fetchQuerySolution(id as string);
            console.log(result);
            setSolution(result);

            // 如果 solution 中有 cited_papers，获取详细信息
            if (result?.cited_papers) {
                const papersDetails = await Promise.all(
                    result.cited_papers.map(async (paperId) => {
                        return await fetchPaperDetails(paperId); // 获取每个 paper 的详细信息
                    })
                );
                setCitedPapersDetails(papersDetails); // 保存详细的 paper 数据
            }
            setLoading(false);
        } catch (err) {
            setError('Error fetching solution or cited papers');
            setLoading(false);
        }
    }, [id, client]);

    useEffect(() => {
        handleQuerySolution();
    }, [handleQuerySolution]);

    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        const initializeLikeStatus = async () => {
            try {
                const likedStatuses = await fetchQueryLikedSolutions([id as string]);
                console.log(likedStatuses);

                const newLikedStates = likedStatuses.reduce((acc, { solution_id, isLiked }) => {
                    acc[solution_id] = isLiked;
                    return acc;
                }, {});
                setIsLiked(newLikedStates[id as string] || false);
            } catch (error) {
                console.error("Failed to fetch liked status", error);
            }
        };
        initializeLikeStatus();
    }, [id]);

    const handleLiked = async () => {
        setIsLiked(!isLiked);
        const result = await fetchLikeSolution(id as string);
        console.log(result);
    };

    return (
        <div className="flex flex-col ml-[12.5rem] bg-primary min-h-screen p-6">
            <div className="w-full max-w-[80%] mx-auto">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-xl font-bold text-text-primary">
                        {solution?.['solution']?.Title || 'Loading...'}
                    </h1>
                    <button
                        className={`text-3xl ml-3 p-[0.2rem] transition-transform duration-200 ease-in-out
                            hover:scale-110 active:scale-100 cursor-pointer`}
                        style={{
                            color: isLiked ? '#ff6961' : '#BBBBBB',
                            zIndex: '1001',
                        }}
                        onClick={handleLiked}
                    >
                        <FaHeart />
                    </button>
                </div>

                <div className="flex flex-col md:flex-row">
                    <div className="flex flex-col md:w-1/3 mr-4">
                        {solution?.['solution']?.['image_url'] && (
                            <div className="flex justify-center mb-6">
                                <img
                                    src={solution?.['solution']?.['image_url']}
                                    alt="solution"
                                    className="rounded-lg max-w-full max-h-[400px] object-cover"
                                />
                            </div>
                        )}

                        <div className="bg-secondary p-4 rounded-lg mt-6">
                            <h2 className="text-lg font-semibold text-text-primary">Score</h2>
                            <div className="bg-border-primary h-2 mt-2 rounded">
                                <div
                                    className="bg-yellow-500 h-full rounded"
                                    style={{
                                        width: `${((solution?.['solution']?.['Evaluation_Result']?.['score'] || 0) / 7) * 100
                                            }%`,
                                    }}
                                ></div>
                            </div>
                            <p className="text-sm mt-2 text-text-secondary">
                                Score: {solution?.['solution']?.['Evaluation_Result']?.['score'] || 'N/A'} / 7
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col md:w-2/3 bg-secondary p-6 rounded-lg shadow-lg mt-6 md:mt-0 space-y-4">
                        <div>
                            <h2 className="text-lg font-semibold text-text-primary mb-2">Query</h2>
                            <p className="text-sm text-text-secondary">{solution?.['query'] || 'Loading...'}</p>
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-text-primary mb-2">Function</h2>
                            <p className="text-sm text-text-secondary">{solution?.['solution']?.['Function'] || 'Loading...'}</p>
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-text-primary mb-2">Use Case</h2>
                            <p className="text-sm text-text-secondary">{solution?.['solution']?.['Use Case'] || 'Loading...'}</p>
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-text-primary mt-4 mb-2">User</h2>
                            <p className="text-sm text-text-secondary">
                                User: {solution?.['user_id'] || 'loading...'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-secondary p-6 rounded-lg shadow-lg mt-4">
                    <h2 className="text-lg font-semibold text-text-primary mb-4">Cited Papers</h2>
                    {loading ? (
                        <div className="text-text-secondary">Loading Cited Papers...</div>
                    ) : citedPapersDetails.length > 0 ? (
                        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                            {citedPapersDetails.map((paperDetail, index) => (
                                <li key={index} className="text-blue-400 hover:underline">
                                    <Link href={`/paper/${paperDetail['_id']}`} target="_blank" rel="noopener noreferrer">
                                        {paperDetail['_id']}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-text-secondary">No cited papers available.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SolutionCard;
