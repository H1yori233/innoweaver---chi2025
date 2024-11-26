import React, { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import MeiliSearch from "meilisearch";
import JsonViewer from "@/comp/paper/JsonViewer";

const PaperSearch = ({ onSelectionChange }) => {
  const apiUrl = process.env.API_URL.replace(':5000', ':7700/');
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedPapers, setSelectedPapers] = useState([]);

  const scrollContainerRef = useRef(null);
  const client = useMemo(() => new MeiliSearch({ host: apiUrl }), [apiUrl]);

  // Fetch papers based on the query
  const fetchPapers = useCallback(
    async (searchQuery = "", pageNumber = 1) => {
      if (!searchQuery.trim()) {
        if (pageNumber === 1) setPapers([]);
        setHasMore(false);
        return;
      }

      setLoading(true);
      try {
        const index = client.index("paper_id");
        const searchResults = await index.search(searchQuery, {
          offset: (pageNumber - 1) * 10,
          limit: 10,
        });
        setPapers((prev) =>
          pageNumber === 1 ? searchResults.hits : [...prev, ...searchResults.hits]
        );
        setHasMore(searchResults.hits.length > 0);
      } catch (error) {
        console.error("Error fetching papers:", error);
      } finally {
        setLoading(false);
      }
    },
    [client]
  );

  const togglePaperSelection = (paperId) => {
    setSelectedPapers((prevSelected) => {
      const isSelected = prevSelected.includes(paperId);
      const updatedSelection = isSelected
        ? prevSelected.filter((id) => id !== paperId)
        : [...prevSelected, paperId];

      onSelectionChange && onSelectionChange(updatedSelection);
      return updatedSelection;
    });
  };

  const isPaperSelected = (paperId) => selectedPapers.includes(paperId);

  const handleSearch = (e) => {
    setQuery(e.target.value);
    setPage(1);
    fetchPapers(e.target.value, 1);
  };

  const handleScroll = () => {
    if (
      scrollContainerRef.current &&
      scrollContainerRef.current.scrollTop + scrollContainerRef.current.clientHeight >=
      scrollContainerRef.current.scrollHeight - 5
    ) {
      if (!loading && hasMore) {
        setPage((prevPage) => prevPage + 1);
      }
    }
  };

  useEffect(() => {
    if (page > 1) fetchPapers(query, page);
  }, [page, fetchPapers, query]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  return (
    <div
      className="flex flex-col md:flex-row items-start justify-center 
        w-full h-full max-w-6xl bg-primary p-6 rounded-lg shadow-lg gap-2"
    >
      <div className="flex flex-col items-center w-full md:w-2/3 h-full space-y-4">
        {/* Search Bar */}
        <div className="relative w-full">
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-placeholder">
            <FaSearch />
          </span>
          <input
            type="text"
            className="w-full pl-12 pr-4 py-3 text-lg border border-border-primary 
              rounded-lg bg-primary text-text-primary outline-none shadow 
              focus:ring focus:ring-border-secondary focus:border-border-secondary transition-all duration-300"
            placeholder="Search solutions..."
            value={query}
            onChange={handleSearch}
          />
        </div>

        {/* Search Results */}
        <div
          ref={scrollContainerRef}
          className="w-full flex-1 overflow-y-auto bg-primary rounded-lg space-y-3"
        >
          {query.trim() === "" ? (
            <p className="text-text-placeholder text-center">Please enter a search term to begin.</p>
          ) : loading && page === 1 ? (
            <p className="text-text-primary text-lg">Loading papers...</p>
          ) : papers.length === 0 ? (
            <p className="text-text-placeholder text-center">
              No results found for "{query}".
            </p>
          ) : (
            papers.map((paper) => (
              <div
                key={paper["_id"]}
                className={`cursor-pointer p-3 rounded-lg ${isPaperSelected(paper["_id"])
                    ? "bg-secondary"
                    : "bg-primary"
                  } hover:border-border-hover transition`}
                onClick={() => togglePaperSelection(paper["_id"])}
              >
                <JsonViewer jsonData={paper} />
              </div>
            ))
          )}
        </div>

        {!loading && !hasMore && (
          <p className="text-sm text-text-placeholder text-center mt-4">
            No more papers to load
          </p>
        )}
      </div>

      <div className="w-full md:w-1/3 h-full flex flex-col bg-secondary rounded-lg shadow-md p-4 ml-2">
        <h3 className="text-text-primary font-semibold text-lg mb-4">Selected Papers</h3>
        {selectedPapers.length > 0 ? (
          <ul className="text-text-secondary space-y-2 overflow-y-auto">
            {selectedPapers.map((id) => (
              <li
                key={id}
                className="text-sm cursor-pointer hover:text-accent-red transition"
                onClick={() => togglePaperSelection(id)}
              >
                {id}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-text-placeholder">No papers selected.</p>
        )}
      </div>
    </div>
  );
};

export default PaperSearch;
