"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { MeiliSearch } from 'meilisearch';
import JsonViewer from '@/comp/paper/JsonViewer';
import { FaSearch, FaUpload } from 'react-icons/fa';
import Link from 'next/link';

const Papers = () => {
    // const apiUrl = process.env.API_URL.replace(':5000', ':7700/');
    const apiUrl = '120.55.193.195:7700/';
    const [loading, setLoading] = useState(true);
    const [papers, setPapers] = useState([]);
    const [error, setError] = useState(null);
    const [query, setQuery] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const scrollContainerRef = useRef(null);

    const client = useMemo(() => new MeiliSearch({ host: apiUrl }), [apiUrl]);
    const fetchPapers = useCallback(async (searchQuery = '', pageNumber = 1) => {
        setLoading(true);
        try {
            const index = client.index('paper_id');
            const searchResults = await index.search(searchQuery, {
                limit: 10,
                offset: (pageNumber - 1) * 10,
            });
            if (searchResults.hits.length > 0) {
                setPapers((prevPapers) => (pageNumber === 1 ? searchResults.hits : [...prevPapers, ...searchResults.hits]));
                setHasMore(true);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            setError('Error fetching papers');
        } finally {
            setLoading(false);
        }
    }, [client]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        setPapers([]);

        if (query != '') {
            fetchPapers(query, 1);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            if (scrollContainerRef.current) {
                const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
                if (scrollTop + clientHeight >= scrollHeight - 50 && !loading && hasMore) {
                    setPage((prevPage) => prevPage + 1);
                }
            }
        };

        const container = scrollContainerRef.current;
        container?.addEventListener('scroll', handleScroll);
        return () => container?.removeEventListener('scroll', handleScroll);
    }, [loading, hasMore]);

    return (
        <div
            ref={scrollContainerRef}
            className="h-screen overflow-y-auto ml-[12.5rem] bg-primary text-text-primary"
        >
            <div className="flex flex-col items-center mt-8">
                <header className="mb-6 w-full flex items-center justify-center px-6 max-w-5xl">
                    {/* <Link href="/paper/upload" passHref>
                        <div
                            role="button"
                            className="mr-4 p-2 bg-secondary text-text-primary rounded-full hover:bg-secondary transition-colors duration-300 cursor-pointer flex items-center"
                        >
                            <FaUpload size={20} />
                        </div>
                    </Link> */}

                    <form onSubmit={handleSearch} className="flex justify-center flex-grow max-w-3xl">
                        <div className="relative w-full">
                            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-placeholder">
                                <FaSearch />
                            </span>
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search papers by keyword"
                                className="w-full pl-12 pr-4 py-3 text-lg border border-border-primary rounded-lg bg-primary text-text-primary outline-none shadow focus:ring focus:ring-border-secondary focus:border-border-secondary transition-all duration-300"
                            />
                        </div>
                    </form>
                </header>
            </div>

            {loading && page === 1 ? (
                <div className="text-lg mt-24 text-center text-text-secondary">
                    Loading...
                </div>
            ) : error ? (
                <div className="text-center mt-24 text-red-500">
                    {error}
                </div>
            ) : (
                <div>
                    <ul className="list-none p-0">
                        {papers.map((paper, index) => (
                            <li key={index} className="mb-2">
                                <JsonViewer jsonData={paper} />
                            </li>
                        ))}
                    </ul>
                    {loading && page > 1 && (
                        <div className="text-center mt-4 text-text-secondary">
                            Loading more...
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Papers;
