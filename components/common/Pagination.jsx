"use client";
import ReactPaginate from "react-paginate";

const Pagination = ({
  lastPage,
  handlePageClick,
  currentPage,
  perPage,
  total,
}) => {
  const start = (currentPage - 1) * perPage + 1;
  const end = Math.min(currentPage * perPage, total);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-[14px] font-semibold text-merchant-paragraph">
        {total > 0 ? `Showing ${start} to ${end} of ${total}` : "No results"}
      </p>
      <div className="main-pagination">
        <ReactPaginate
          forcePage={currentPage - 1}
          breakLabel="..."
          nextLabel="Next"
          previousLabel="Previous"
          onPageChange={handlePageClick}
          pageRangeDisplayed={2}
          marginPagesDisplayed={1}
          pageCount={lastPage || 0}
          breakClassName="cursor-pointer"
          breakLinkClassName="w-full h-full flex items-center justify-center font-bold text-[rgba(45,45,45,0.60)]
          "
          containerClassName="flex items-center space-x-3"
          pageClassName="h-[40px] w-[40px] border border-[rgba(26,32,44,0.10)] rounded-[8px] flex items-center justify-center text-[16px] font-bold text-[rgba(12,3,16,0.60)] cursor-pointer"
          pageLinkClassName="w-full h-full flex items-center justify-center"
          activeClassName="bg-merchant-primary text-white border-merchant-primary"
          previousClassName="flex items-center justify-center text-[14px] text-merchant-text font-bold cursor-pointer hover:text-merchant-text"
          previousLinkClassName="w-full h-full flex items-center justify-center"
          nextClassName="flex items-center justify-center text-[14px] text-merchant-text font-bold cursor-pointer hover:text-merchant-text"
          nextLinkClassName="w-full h-full flex items-center justify-center"
          disabledClassName="opacity-50 cursor-not-allowed"
        />
      </div>
    </div>
  );
};

export default Pagination;
