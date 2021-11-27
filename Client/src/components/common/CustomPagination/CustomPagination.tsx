import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import classes from "./style.module.css";
import { FormControl, Pagination } from "react-bootstrap";
import { range } from "lodash";

const PAGE_LIMIT_OPTIONS = [
  { label: "10", value: "10" },
  { label: "20", value: "20" },
  { label: "25", value: "25" },
  { label: "50", value: "50" },
];

export interface CustomPaginationProps {
  active?: number;
  onPageChange?: Function;
  onLimitChange?: Function;
  totalItems: number;
  hideLimit?: boolean;
  pageLimit?: number;
}

const CustomPagination = ({
  active: _active = 1,
  totalItems,
  onPageChange,
  onLimitChange,
  pageLimit = 10,
  hideLimit = false,
}: CustomPaginationProps) => {
  const [active, setActive] = useState<number>(_active);
  const [limit, setLimit] = useState<number>(pageLimit);
  const [pageCount, setPageCount] = useState<number>(0);
  const [visiblePages, setVisiblePages] = useState<number[]>([]);

  useEffect(() => {
    if (totalItems) {
      setPageCount(Math.ceil(totalItems / limit));
    }
  }, [totalItems, limit]);

  const getVisiblePages = useCallback(() => {
    if (pageCount > 5) {
      if (active <= 3) {
        return range(1, 5);
      } else if (active >= pageCount - 2) {
        return range(pageCount - 4, pageCount);
      }
      return range(active - 2, active + 2);
    }
    return range(1, pageCount + 1);
  }, [pageCount, active]);

  useEffect(() => {
    setVisiblePages(getVisiblePages());
  }, [active, getVisiblePages]);

  const limitChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const newLimit = e.currentTarget.value;
    setLimit(parseInt(newLimit));
    setActive(1);
    if (onLimitChange) {
      onLimitChange(1, newLimit);
    }
  };

  const navigateToFirstPage = () => {
    setActive(1);
    if (onPageChange) {
      onPageChange(1, limit);
    }
  };

  const navigateToLastPage = () => {
    setActive(pageCount);
    if (onPageChange) {
      onPageChange(pageCount, limit);
    }
  };

  const navigateToNextPage = () => {
    if (active < pageCount) {
      setActive(active + 1);
      if (onPageChange) {
        onPageChange(active + 1, limit);
      }
    }
  };

  const navigateToPreviousPage = () => {
    if (active > 1) {
      setActive(active - 1);
      if (onPageChange) {
        onPageChange(active - 1, limit);
      }
    }
  };

  const navigateToSpecificPage = (page: number) => {
    setActive(page);
    if (onPageChange) {
      onPageChange(page, limit);
    }
  };

  if (pageCount > 1) {
    return (
      <div className={classes.paginationContainer}>
        {pageCount}
        {hideLimit ? null : (
          <FormControl
            name="pageLimit"
            id="pageLimit"
            value={limit}
            as="select"
            onChange={limitChangeHandler}
            className={classes.pageLimitSelect}
          >
            {PAGE_LIMIT_OPTIONS.map(({ label, value }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </FormControl>
        )}

        <Pagination>
          <Pagination.First onClick={navigateToFirstPage} />
          <Pagination.Prev onClick={navigateToPreviousPage} />
          {pageCount > 5 && active > 3 && (
            <>
              {" "}
              <Pagination.Item onClick={() => navigateToSpecificPage(1)}>
                {1}
              </Pagination.Item>
              {active > 4 && <Pagination.Ellipsis />}
            </>
          )}

          {visiblePages?.map((page) => (
            <Pagination.Item
              key={page}
              active={page === active}
              onClick={() => navigateToSpecificPage(page)}
            >
              {page}
            </Pagination.Item>
          ))}

          {pageCount > 5 && active < pageCount - 2 && (
            <>
              {" "}
              {active < pageCount - 3 && <Pagination.Ellipsis />}
              <Pagination.Item
                onClick={() => navigateToSpecificPage(pageCount)}
              >
                {pageCount}
              </Pagination.Item>
            </>
          )}
          <Pagination.Next onClick={navigateToNextPage} />
          <Pagination.Last onClick={navigateToLastPage} />
        </Pagination>
      </div>
    );
  } else {
    return null;
  }
};

export default CustomPagination;
