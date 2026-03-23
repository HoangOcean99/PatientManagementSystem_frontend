import { useState, useEffect } from "react";
import * as Icons from "lucide-react";

const SearchFilterBar = ({
    placeholder = "Tìm kiếm...",
    filters = [],
    defaultFilter,
    onSearch,
    onFilterChange
}) => {
    const [keyword, setKeyword] = useState("");
    const [activeFilter, setActiveFilter] = useState(defaultFilter || filters[0]);

    useEffect(() => {
        if (onSearch) onSearch(keyword);
    }, [keyword]);

    const handleFilterClick = (item) => {
        setActiveFilter(item);
        if (onFilterChange) onFilterChange(item);
    };

    return (
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="relative flex-1 group">
                <Icons.Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors"
                    size={20}
                />
                <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder={placeholder}
                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-400 transition-all shadow-sm"
                />
            </div>

            {filters.length > 0 && (
                <div className="flex p-1 bg-gray-100 rounded-2xl w-fit">
                    {filters.map((item) => (
                        <button
                            key={item}
                            onClick={() => handleFilterClick(item)}
                            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeFilter === item
                                ? "bg-white text-blue-600 shadow-sm"
                                : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            {item}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchFilterBar;