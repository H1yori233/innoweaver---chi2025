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

//封装searchBar
const SearchBar = ({handleSearch,query,setQuery})=>{
    return (
        <div className="flex justify-center mt-8">
        <header className="mb-6 text-center w-full">
            {/*搜索表单*/}
            <form onSubmit={handleSearch} className="flex justify-center">
                <div className="relative w-[80%] max-w-3xl">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400">
                        <FaSearch />{/*搜索图标*/}
                    </span>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search Bar is here"
                        className="w-full pl-12 pr-4 py-3 text-lg border border-neutral-700 rounded-lg bg-neutral-800 text-neutral-100 outline-none shadow focus:ring focus:ring-neutral-700 focus:border-neutral-500 transition-all duration-300"
                    />
                </div>
            </form>
        </header>
    </div>
    );
}

const Gallery = () => {
    // 获取环境变量中的 API 地址，并替换端口号
    // const apiUrl = process.env.API_URL.replace(':5000', ':7700/');
    const apiUrl = '120.55.193.195:7700/';

    console.log(apiUrl)
    // 定义组件的状态
    const [loading, setLoading] = useState(true);//是否加载
    const [solutions, setSolutions] = useState([]);//已加载的解决方案
    const [likedSolutions, setLikedSolutions] = useState({});//每个解决方案的点赞状态
    const [error, setError] = useState(null);//错误状态，初始化为空

    const [query, setQuery] = useState('');//搜索关键词
    const [page, setPage] = useState(1);//当前页码，初始化为1
    const [hasMore, setHasMore] = useState(true);//是否有更多解决方案可以加载

    const scrollContainerRef = useRef(null);//监听滚动事件的容器引用，初始化为空
    //使用useMemo创建MeiliSearch客户端实例，避免每次渲染时重新创建
    const client = useMemo(() => new MeiliSearch({ host: apiUrl }), [apiUrl]);
    //定义了一个fetchSolutions函数，用于从MeiliSearch中获取解决方案
    const fetchSolutions = useCallback(async (searchQuery = '', pageNumber = 1) => {
        setLoading(true);//开始加载
        try {
            const index = client.index('solution_id');//获取索引实例
            // const keywords = searchQuery.trim().split(/\s+/);

            // await index.updateSortableAttributes(['timestamp']);
            // console.log("执行搜索查询")
            console.log(searchQuery)
            const searchResults = await index.search(searchQuery, {
                limit: 10,//每页加载十条
                offset: (pageNumber - 1) * 10,//分页偏移量
                sort: ['timestamp:desc'],//按时间戳降序排序
            });
            // console.log("搜索查询结束")

            if (searchResults.hits.length > 0) {
                //处理搜索结果，修改id的命名方式
                const modifiedResults = searchResults.hits.map((hit) => ({
                    ...hit,
                    id: hit._id,//将_id转换为id
                    _id: undefined,//删除原始_id字段
                }));
                //更新solution状态，根据页码决定覆盖还是追加
         //-------------------------------------------------将新搜索的页面进行追加的逻辑-------------------------------//
                setSolutions((prevPapers) => (pageNumber === 1 ? modifiedResults : [...prevPapers, ...modifiedResults]));
                
                //获取解决方案的点赞状态
                const solutionIds = modifiedResults.map(solution => solution.id);
                const likedStatuses = await fetchQueryLikedSolutions(solutionIds);
                console.log(likedStatuses);
                //将点赞状态转换为对象形式
                const newLikedStates = likedStatuses.reduce((acc, { solution_id, isLiked }) => {
                    acc[solution_id] = isLiked;
                    return acc;
                }, {});

                setLikedSolutions(prevLiked => ({
                    ...prevLiked,
                    ...newLikedStates,//合并新旧点赞状态
                }));

                setHasMore(true);//标记还有更多数据
            } else {
                console.log("None is display")
                setHasMore(false);//如果返回结果的长队为0，没有更多数据了
            }
        } catch (error) {
            setError('Error fetching papers');
        } finally {
            setLoading(false);
        }
    }, [client]);

    //初始化加载数据或当查询条件，页码变化时加载数据
    useEffect(() => {
        fetchSolutions(query, page);
    }, [query, page, fetchSolutions]);
    //搜索表单提交事件发生时的处理函数
    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        setSolutions([]);
        fetchSolutions(query, 1);
    };


    //监听滚动时间，实现滚动加载
    //要将滚动监听转化为分页模式，在底部添加一个分页的组件
//--------------------------------------处理滚动下滑刷新的函数---------------------------------------------//    
    useEffect(() => {
        const handleScroll = () => {
            if (scrollContainerRef.current) {
                const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
                //如果滚动到了底部，加载下一页数据
                if (scrollTop + clientHeight >= scrollHeight - 50 && !loading && hasMore) {
                    setPage((prevPage) => prevPage + 1);
                }
            }
        };

        const container = scrollContainerRef.current;
        container?.addEventListener('scroll', handleScroll);//绑定滚动事件
        return () => container?.removeEventListener('scroll', handleScroll);//清理事件
    }, [loading, hasMore]);
//-------------------------------------------------------------------------------------------------------//

    return (
        <div
            ref={scrollContainerRef}//滚动容器引用
            style={{ height: '100vh', overflowY: 'auto', marginLeft: '15rem' }}//滚动容器样式
        >
            <SearchBar handleSearch={handleSearch} query={query} setQuery={setQuery}/>
            {/* <div className="flex justify-center mt-8">
                <header className="mb-6 text-center w-full"> */}
                    {/* 搜索表单 */}
                    {/* <form onSubmit={handleSearch} className="flex justify-center">
                        <div className="relative w-[80%] max-w-3xl">
                            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400"> */}
                                {/* <FaSearch />搜索图标 */}
                            {/* </span>
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search Bar is here"
                                className="w-full pl-12 pr-4 py-3 text-lg border border-neutral-700 rounded-lg bg-neutral-800 text-neutral-100 outline-none shadow focus:ring focus:ring-neutral-700 focus:border-neutral-500 transition-all duration-300"
                            />
                        </div>
                    </form>
                </header>
            </div> */}

            {loading && page === 1 ? (
                <div className="text-2xl mt-24 text-center text-text-secondary">
                    Loading...
                </div>
            ) : error ? (
                <div className="text-center mt-24 text-red-500">
                    {error}
                </div>
            ) : (
                <div>
                    <MasonryGallery solutions={solutions} likedSolutions={likedSolutions} />
                    {loading && page > 1 && (
                        <div className="text-center mt-4 text-text-placeholder">Loading more...</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Gallery;
