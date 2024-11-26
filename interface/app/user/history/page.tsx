"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { MeiliSearch } from 'meilisearch';
import MiniCard from '@/comp/solution/MiniCard';
import Masonry from 'react-masonry-css';
import { fetchQueryLikedSolutions } from '@/lib/actions';
import { FaSearch } from 'react-icons/fa';

interface MasonryGalleryProps {
    solutions: any[];
    likedSolutions: { [key: string]: boolean };
}

const MasonryGallery: React.FC<MasonryGalleryProps> = ({ solutions, likedSolutions }) => {
    const columns = Math.min(5, solutions.length);
    const breakpointColumnsObj = {
        default: columns,
        1600: Math.min(4, solutions.length),
        1200: Math.min(3, solutions.length),
        800: Math.min(2, solutions.length),
        640: 1,
    };

    const [likes, setLikes] = useState({});
    useEffect(() => {
        setLikes(likedSolutions);
    }, [likedSolutions]);

    return (
        <div className="flex justify-center p-4 w-full">
            <Masonry
                breakpointCols={breakpointColumnsObj}
                className="flex"
                columnClassName="masonry-grid_column flex flex-col"
            >
                {solutions.map((solution, index) => (
                    <MiniCard
                        key={index}
                        content={solution}
                        index={index}
                        isLiked={likes[solution.id]}
                    />
                ))}
            </Masonry>
        </div>
    );
};


const History = () => {
    const apiUrl = process.env.API_URL.replace(':5000', ':7700/');
    const [loading, setLoading] = useState(true);
    const [solutions, setSolutions] = useState([]);
    const [likedSolutions, setLikedSolutions] = useState({});
    const [error, setError] = useState(null);

    const [query, setQuery] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const scrollContainerRef = useRef(null);

    const client = useMemo(() => new MeiliSearch({ host: apiUrl }), [apiUrl]);
    const fetchSolutions = useCallback(async (searchQuery = '', pageNumber = 1) => {
        setLoading(true);
        try {
            const index = client.index('solution_id');
            const id = localStorage.getItem('id');

            console.log(id);
            const searchResults = await index.search(searchQuery, {
                limit: 10,
                offset: (pageNumber - 1) * 10,
                filter: [`user_id="${id}"`],
                sort: ['timestamp:desc'],
            });
            if (searchResults.hits.length > 0) {
                const modifiedResults = searchResults.hits.map((hit) => ({
                    ...hit,
                    id: hit._id,
                    _id: undefined,
                }));

                setSolutions((prevPapers) => (pageNumber === 1 ? modifiedResults : [...prevPapers, ...modifiedResults]));

                const solutionIds = modifiedResults.map(solution => solution.id);
                const likedStatuses = await fetchQueryLikedSolutions(solutionIds);
                console.log(likedStatuses);

                const newLikedStates = likedStatuses.reduce((acc, { solution_id, isLiked }) => {
                    acc[solution_id] = isLiked;
                    return acc;
                }, {});
                setLikedSolutions(prevLiked => ({
                    ...prevLiked,
                    ...newLikedStates,
                }));

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

    useEffect(() => {
        fetchSolutions(query, page);
    }, [query, page, fetchSolutions]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        setSolutions([]);
        fetchSolutions(query, 1);
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
            <div className="flex justify-center mt-8">
                <header className="mb-6 text-center w-full">
                    <form onSubmit={handleSearch} className="flex justify-center">
                        <div className="relative w-[80%] max-w-3xl">
                            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-placeholder">
                                <FaSearch />
                            </span>
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search History"
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
                <div className="mt-24 text-center text-red-500">
                    {error}
                </div>
            ) : (
                <div>
                    <MasonryGallery solutions={solutions} likedSolutions={likedSolutions} />
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

export default History;
