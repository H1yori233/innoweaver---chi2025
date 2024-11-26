"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams } from "next/navigation";
import { MeiliSearch } from "meilisearch";
import Link from "next/link";

const Metadata = ({ data }) => {
    return (
        <div className="bg-primary p-6 rounded-lg shadow-lg mb-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4">
                {data["Title"] ? data["Title"] : "Paper Information"}
            </h2>
            <div className="text-text-secondary space-y-2">
                {data["Author"] && (
                    <p>
                        <strong>Author:</strong> {data["Author"]}
                    </p>
                )}
                {data["Keywords"] && (
                    <p>
                        <strong>Keywords:</strong> {data["Keywords"]}
                    </p>
                )}
                {data["DOI"] && (
                    <p>
                        <strong>DOI:</strong>{" "}
                        <Link
                            href={`https://doi.org/${data["DOI"]}`}
                            target="_blank"
                            className="text-blue-400 underline"
                        >
                            {data["DOI"]}
                        </Link>
                    </p>
                )}
                {data["Cited"] && (
                    <p>
                        <strong>Cited:</strong> {data["Cited"]}
                    </p>
                )}
                {data["Series"] && (
                    <p>
                        <strong>Series:</strong> {data["Series"]}
                    </p>
                )}
            </div>
        </div>
    );
};

const Paper = () => {
    // const apiUrl = process.env.API_URL.replace(":5000", ":7700/");
    const apiUrl = '120.55.193.195:7700/';
    const { id } = useParams();
    const [paper, setPaper] = useState([]);
    const client = useMemo(() => new MeiliSearch({ host: apiUrl }), [apiUrl]);

    const sortPaper = (paperData) => {
        const orderedData = {};
        const primaryFields = ["id", "Title", "Author", "DOI", "Keywords", "Series"];
        primaryFields.forEach((key) => {
            if (key in paperData) {
                orderedData[key] = paperData[key];
                delete paperData[key];
            }
        });
        return { ...orderedData, ...paperData };
    };

    const handleQuerySolution = useCallback(async () => {
        const fetchPaperDetails = async (paperId) => {
            const index = client.index("paper_id");
            const searchResults = await index.search(paperId, { limit: 1 });
            return searchResults.hits.length > 0 ? searchResults.hits[0] : null;
        };

        try {
            const result = await fetchPaperDetails(id);
            if (result) {
                setPaper(sortPaper(result));
            } else {
                console.error("Paper not found");
            }
        } catch (err) {
            console.error("Error fetching paper:", err);
        }
    }, [id, client]);

    useEffect(() => {
        handleQuerySolution();
    }, [handleQuerySolution]);

    const JsonNode = ({ keyName, value, isFirst = true }) => {
        const displayKey = !isFirst && isNaN(Number(keyName)) ? `${keyName}:` : null;
        const isExpandable = typeof value === "object" && value !== null;
        const isIdLink = keyName === "_id";

        const renderValue = () => {
            if (isIdLink) {
                return (
                    <Link
                        href={`/paper/${value}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 underline"
                    >
                        {value}
                    </Link>
                );
            }
            return <span className="text-ellipsis overflow-hidden">{value}</span>;
        };

        return (
            <div className="flex flex-col mt-3 text-text-secondary">
                <div className="flex items-start">
                    {displayKey && <strong className="whitespace-nowrap mr-2">{displayKey}</strong>}
                    {!isExpandable && renderValue()}
                </div>

                {isExpandable && (
                    <div className="ml-5 border-l-2 border-border-secondary pl-4 mt-1">
                        {Array.isArray(value)
                            ? value.map((item, index) => (
                                <JsonNode key={index} keyName={index} value={item} isFirst={false} />
                            ))
                            : Object.entries(value).map(([subKey, subValue]) => (
                                <JsonNode key={subKey} keyName={subKey} value={subValue} isFirst={false} />
                            ))}
                    </div>
                )}
            </div>
        );
    };

    const orderedKeys = ["Target Definition", "Artifact Knowledge", "Results", "Contributions", "Second Extraction"];

    const renderOrderedJson = (data) => {
        const keys = Object.keys(data);
        const ordered = orderedKeys.filter((key) => keys.includes(key));
        return ordered.map((key) => (
            <div key={key} className="bg-primary p-6 mb-6 rounded-lg shadow-lg">
                <h2 className="text-lg font-semibold text-text-primary mb-4 border-b border-border-secondary pb-2">
                    {key.replace(/_/g, " ")}
                </h2>
                <JsonNode keyName={key} value={data[key]} />
            </div>
        ));
    };

    return (
        <div className="flex bg-secondary text-text-primary min-h-screen pl-[12.5rem]">
            <div className="w-full max-w-[80%] mx-auto py-10 overflow-y-auto">
                <Metadata data={paper} />
                {renderOrderedJson(paper)}
            </div>
        </div>
    );
};

export default Paper;
