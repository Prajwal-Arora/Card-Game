import React, { useState } from "react";
import { Table } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import CustomPagination from "../CustomPagination";
import { CustomPaginationProps } from "../CustomPagination/CustomPagination";
import "./index.css";

interface CustomTableProps {
  columns: {
    label: string;
    key: string;
    render?: Function;
  }[];
  rows: object[];
  totalItems: number;
  loading?: boolean;
  paginationProps?: CustomPaginationProps;
}

const CustomTable = ({
  columns,
  rows,
  loading,
  paginationProps,
  totalItems,
  ...restProps
}: CustomTableProps) => {
  const {
    pageLimit = 10,
    onLimitChange,
    ...restPaginationProps
  } = paginationProps ?? {};
  const [limit, setLimit] = useState(pageLimit);

  const handleLimitChange = (pageNo: number, limit: number) => {
    setLimit(limit);
    if (onLimitChange) {
      onLimitChange(pageNo, limit);
    }
  };

  return (
    <div className="battle-history-table ">
      <Table responsive striped hover variant="dark" {...restProps}>
        {/* <thead className="t-head">
          <tr>
            {columns.map(({ key, label }) => {
              return <th key={key}>{label}</th>;
            })}
          </tr>
        </thead> */}

        <tbody>
          {rows.slice(0, limit).map((row: any) => {
            return (
              <tr key={row?.id}>
                {columns.map(({ key, render }) => {
                  if (render) {
                    return (
                      <td key={key}>
                        <span className={"td-item  gradient-text "}>
                          {render(row)}
                        </span>
                      </td>
                    );
                  }
                  return (
                    <>
                      <td key={key}>
                        <span className={"td-item  gradient-text "}>
                          {row[key]}{" "}
                        </span>
                      </td>
                    </>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
        {/* </InfiniteScroll> */}
      </Table>
      {rows?.length === 0 ? (
        <p className="no-data-message">No Data Found</p>
      ) : null}
      {/* <div>
        <CustomPagination
          {...restPaginationProps}
          totalItems={totalItems}
          onLimitChange={handleLimitChange}
          pageLimit={limit}
        />
      </div> */}
    </div>
  );
};

export default CustomTable;
