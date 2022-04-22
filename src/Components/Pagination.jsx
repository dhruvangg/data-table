export default function Pagination({ paging, action }) {
    const { total, currPage, items_per_page } = paging
    const { filter, setFilter } = action
    const { totalItems, startIndex, endPage, endIndex, pages } = paginate(total, currPage, items_per_page);
    const firstItem = startIndex + 1;
    const lastItem = endIndex + 1;
    return (
        <div className="flex justify-between mt-4 text-sm">
            <label>Showing {firstItem} to {lastItem} of {totalItems} entries</label>
            <ul className="flex border-collapse">
                <li className="border border-collapse rounded-l-lg border-r-0"><button className={`px-4 py-2 ${currPage === 1 && 'text-gray-200 cursor-not-allowed'}`} disabled={currPage === 1} onClick={() => setFilter({ ...filter, page: currPage - 1 })}>Previous</button></li>
                {pages.map(page => {
                    return <li className="border border-collapse" key={page}>
                        <button className={`px-4 py-2 ${page === currPage ? 'bg-indigo-700 text-white font-semibold' : ''}`} disabled={page === currPage} onClick={() => setFilter({ ...filter, page })}>{page}</button>
                    </li>
                })}
                <li className="border border-collapse rounded-r-lg border-l-0"><button className={`px-4 py-2 ${currPage === endPage && 'text-gray-200 cursor-not-allowed'}`} disabled={currPage === endPage} onClick={() => setFilter({ ...filter, page: currPage + 1 })}>Next</button></li>
            </ul>
        </div>
    )
}


const paginate = (totalItems, currentPage = 1, pageSize = 2, maxPages = 3) => {

    let totalPages = Math.ceil(totalItems / pageSize);
    if (currentPage < 1) {
        currentPage = 1;
    } else if (currentPage > totalPages) {
        currentPage = totalPages;
    }

    let startPage, endPage;
    if (totalPages <= maxPages) {
        startPage = 1;
        endPage = totalPages;
    } else {
        let maxPagesBeforeCurrentPage = Math.floor(maxPages / 2);
        let maxPagesAfterCurrentPage = Math.ceil(maxPages / 2) - 1;
        if (currentPage <= maxPagesBeforeCurrentPage) {
            startPage = 1;
            endPage = maxPages;
        } else if (currentPage + maxPagesAfterCurrentPage >= totalPages) {
            startPage = totalPages - maxPages + 1;
            endPage = totalPages;
        } else {
            startPage = currentPage - maxPagesBeforeCurrentPage;
            endPage = currentPage + maxPagesAfterCurrentPage;
        }
    }

    let startIndex = (currentPage - 1) * pageSize;
    let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

    let pages = Array.from(Array((endPage + 1) - startPage).keys()).map(i => startPage + i);

    return {
        totalItems: totalItems,
        currentPage: currentPage,
        pageSize: pageSize,
        totalPages: totalPages,
        startPage: startPage,
        endPage: endPage,
        startIndex: startIndex,
        endIndex: endIndex,
        pages: pages
    };
}