import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages === 0) return null;

    const pages = [];
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    
    if (endPage - startPage < 4) {
        startPage = Math.max(1, endPage - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    return (
        <div className="flex gap-2">
            <button 
                onClick={() => onPageChange(currentPage - 1)} 
                disabled={currentPage === 1}
                className="w-9 h-9 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                <i className="fa-solid fa-chevron-left text-xs"></i>
            </button>
            
            {startPage > 1 && (
                <>
                    <button onClick={() => onPageChange(1)} className="px-3.5 h-9 hover:bg-gray-50 rounded-lg text-sm font-bold text-gray-700">1</button>
                    {startPage > 2 && <span className="px-1 py-1 text-gray-400">...</span>}
                </>
            )}

            {pages.map(page => (
                <button 
                    key={page} 
                    onClick={() => onPageChange(page)}
                    className={`px-3.5 h-9 rounded-lg text-sm font-bold transition-all ${
                        currentPage === page 
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-100' 
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}>
                    {page}
                </button>
            ))}

            {endPage < totalPages && (
                <>
                    {endPage < totalPages - 1 && <span className="px-1 py-1 text-gray-400">...</span>}
                    <button onClick={() => onPageChange(totalPages)} className="px-3.5 h-9 hover:bg-gray-50 rounded-lg text-sm font-bold text-gray-700">{totalPages}</button>
                </>
            )}

            <button 
                onClick={() => onPageChange(currentPage + 1)} 
                disabled={currentPage === totalPages}
                className="w-9 h-9 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                <i className="fa-solid fa-chevron-right text-xs"></i>
            </button>
        </div>
    );
};

export default Pagination;
