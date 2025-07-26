import ReactPaginate from "react-paginate";

export default function Pagination({ pageCount, onPageChange, forcePage }) {
  return (
    <ReactPaginate
      breakLabel="..."
      nextLabel="next >"
      previousLabel="< previous"
      pageRangeDisplayed={5}
      marginPagesDisplayed={2}
      pageCount={pageCount}
      onPageChange={onPageChange}
      forcePage={forcePage}
      containerClassName="pagination justify-content-center"
      pageClassName="page-item"
      pageLinkClassName="page-link"
      previousClassName="page-item"
      previousLinkClassName="page-link"
      nextClassName="page-item"
      nextLinkClassName="page-link"
      activeClassName="active"
    />
  );
}
