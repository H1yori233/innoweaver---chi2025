import React, { useState } from "react";
import Link from "next/link";

// 单个节点组件，支持展开/折叠
const JsonNode = ({ keyName, value }: { keyName: string | number; value: any }) => {
    const [isOpen, setIsOpen] = useState(false);
    const isExpandable = typeof value === "object" && value !== null;

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="ml-5">
            {/* 节点标题 */}
            <div
                onClick={isExpandable ? toggleOpen : undefined}
                className={`flex items-center ${isExpandable ? "cursor-pointer" : ""}`}
            >
                {isExpandable && (
                    <span className="cursor-pointer mr-1 select-none">
                        {isOpen ? "▼" : "▶"}
                    </span>
                )}
                <div className="font-bold text-text-primary whitespace-nowrap">{keyName}:</div>

                {/* 链接展示 */}
                {!isExpandable && keyName === "_id" && (
                    <Link
                        href={`/paper/${value}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 text-text-link no-underline hover:text-text-linkHover transition-colors duration-200"
                    >
                        {value}
                    </Link>
                )}

                {/* 普通值展示 */}
                {!isExpandable && keyName !== "_id" && (
                    <div className="flex items-center ml-2.5">
                        <span className="text-text-secondary inline-block whitespace-nowrap overflow-hidden text-ellipsis cursor-pointer">
                            {value}
                        </span>
                    </div>
                )}
            </div>

            {/* 子节点渲染 */}
            {isExpandable && isOpen && (
                <div className="ml-5">
                    {Array.isArray(value)
                        ? value.map((item, index) => (
                            <JsonNode key={index} keyName={index} value={item} />
                        ))
                        : Object.keys(value).map((subKey) => (
                            <JsonNode key={subKey} keyName={subKey} value={value[subKey]} />
                        ))}
                </div>
            )}
        </div>
    );
};

// JSON Viewer 主组件
const JsonViewer = ({ jsonData }: { jsonData: any }) => {
    const orderedKeys = [
        "_id",
        "Title",
        "Author",
        "Keywords",
        "Cited",
        "Liked",
        "DOI",
        "Series",
        "Target Definition",
        "Artifact Knowledge",
        "Results",
        "Second Extraction",
    ];

    // 根据优先级排序渲染 JSON 数据
    const renderOrderedJson = (data: any) => {
        const keys = Object.keys(data);
        const ordered = orderedKeys.filter((key) => keys.includes(key));
        const rest = keys.filter((key) => !orderedKeys.includes(key));
        return [...ordered, ...rest].map((key) => (
            <JsonNode key={key} keyName={key} value={data[key]} />
        ));
    };

    return (
        <div
            className="bg-primary/80 border border-border-secondary p-6 w-full mx-auto rounded-2xl overflow-hidden shadow-primary"
            style={{ maxWidth: "1000px", height: "200px", fontFamily: "Arial, sans-serif" }}
        >
            <div
                className="h-full overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-scrollbar-thumb scrollbar-track-scrollbar-track 
                    hover:scrollbar-thumb-scrollbar-thumbHover"
                style={{ overflowX: 'hidden' }}
            >
                {renderOrderedJson(jsonData)}
            </div>
        </div>
    );
};

export default JsonViewer;
