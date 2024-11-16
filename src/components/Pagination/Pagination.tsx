import React from 'react';
import styles from './pagination.module.scss';
import classNames from "classnames";

interface PaginationPropsITF {
  currentPage: number; // Current page number
  totalPages: number; // Total number of pages
  onPageChange: (page: number) => void; // Callback to handle page change
  pageSize: number; // Number of items per page
}

const Pagination: React.FC<PaginationPropsITF> = ({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
}) => {
  // Calculate the page range to display
  const pageNumbers = Array.from({length: totalPages}, (_, i) => i + 1);

  // Handle click for next page
  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // Handle click for previous page
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  // Handle click for specific page number
  const handlePageClick = (page: number) => {
    onPageChange(page);
  };

  // Generate page number buttons with ellipsis for a cleaner UI
  const getPageButtons = () => {
    if (totalPages <= 7) {
      return pageNumbers; // If there are fewer than 7 pages, show all page numbers
    }

    const pages: (number | string)[] = [];
    if (currentPage <= 4) {
      pages.push(1, 2, 3, 4, 5, '...', totalPages);
    } else if (currentPage >= totalPages - 3) {
      pages.push(
        1,
        '...',
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages
      );
    } else {
      pages.push(
        1,
        '...',
        currentPage - 1,
        currentPage,
        currentPage + 1,
        '...',
        totalPages
      );
    }
    return pages;
  };

  return (
    <div className={styles.container}>
      <p
        className={styles.container_prevAndNext}
        onClick={() => {
          if (currentPage !== 1) handlePrevious();
        }}
      >
        Prev
      </p>
      <div className={styles.container_pages}>
        {getPageButtons().map((page, index) =>
          page === '...' ? (
            <span key={index}>...</span>
          ) : (
            <p
              key={index}
              className={classNames(styles.container_pages_page, page === currentPage && styles.container_pages_page_active)}
              onClick={() => {
                if(page !== currentPage) handlePageClick(page as number);
              }}
            >
              {page}
            </p>
          )
        )}
      </div>

      <p
        className={styles.container_prevAndNext}
        onClick={() => {
          if (currentPage !== totalPages) handleNext();
        }}
      >
        Next
      </p>
    </div>
  );
};

export default Pagination;
