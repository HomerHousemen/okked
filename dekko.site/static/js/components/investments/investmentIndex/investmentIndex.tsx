/** @format **/
import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Paper,
  Link,
  TextField,
} from "@material-ui/core";
import {
  useAPIServiceContext,
  useTableStyles,
  Utils,
} from "@dekko/common";
import { useInvestmentIndex } from "./investmentIndexProvider";
import { InvestmentIndexColumns } from "./investmentIndexColumns";
import { Link as RouterLink } from "react-router-dom";

export const InvestmentIndex = () => {
  const {
    setFilter,
    transformedInvestments,
    sortHandler,
    setPage,
    setRowsPerPage,
    state,
  } = useInvestmentIndex();
  const classes = useTableStyles();
  const { investmentAPI } = useAPIServiceContext();

  const downloadIndex = () => {
    investmentAPI.getInvestmentExport().then((res) => {
      if (res?.success) {
        Utils.downloadFromBlob(res.data, "investments.xlsx");
      }
    });
  };

  return (
    <Paper elevation={5} className={classes.table}>
      <Toolbar className={classes.filterToolbar}>
       
        <TextField
          id="filter list"
          label="Filter"
          variant="outlined"
          value={state?.filter || ""}
          className={classes.filterInput}
          onChange={(event: any) => {
            setFilter(event.target.value);
          }}
        />
      
      </Toolbar>

      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {InvestmentIndexColumns.map((headers, i: number) => (
                <TableCell
                  style={{ minWidth: headers.width }}
                  id={headers.accessor}
                  key={`header${i}`}
                >
                  {headers.Header}
                  {headers.sortable && (
                    <TableSortLabel
                      active={state?.sortColumn === headers.accessor}
                      direction={state?.sortDirection}
                      onClick={() => sortHandler(headers.accessor)}
                    />
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {transformedInvestments
              .slice(
                (state?.page || 0) * (state?.rowsPerPage || 25),
                (state?.page || 0) * (state?.rowsPerPage || 25) +
                  (state?.rowsPerPage || 25)
              )
              .map((investment: any, i: any) => {
                return (
                  <TableRow key={investment.id}>
                    <TableCell>
                      <Link
                        variant="body2"
                        component={RouterLink}
                        to={`/investment/${investment.id}`}
                      >
                        {investment.identifier}
                      </Link>
                    </TableCell>
                    <TableCell>{investment.name}</TableCell>
                    <TableCell>{investment.nickname}</TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={transformedInvestments.length}
        rowsPerPage={state?.rowsPerPage || 25}
        page={state?.page || 0}
        onPageChange={setPage}
        onRowsPerPageChange={setRowsPerPage}
      />
    </Paper>
  );
};
