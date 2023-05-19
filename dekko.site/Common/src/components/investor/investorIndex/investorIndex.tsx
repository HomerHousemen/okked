import * as React from "react";
import { useInvestorIndexContext } from "./investorIndexProvider";
import {
  TableContainer,
  Table,
  TableHead,
  TableSortLabel,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  useMediaQuery,
  MenuItem,
  Toolbar,
  Paper,
  TextField,
  Button,
  Link,
  Theme,
} from "@material-ui/core";
import { getInvestorIndexColumns } from "./investorIndexColumns";
import { Link as RouterLink } from "react-router-dom";
import { useAPIServiceContext, useGlobal, Utils } from "../../global";
import { CanEdit } from "../../common";
import { useTableStyles } from "../../../styling/customStyles";

export const InvestorIndex = () => {
  const {
    setActiveFilter,
    setFilter,
    transformedInvestors,
    sortHandler,
    setPage,
    setRowsPerPage,
    state,
    setEntityFilter,
  } = useInvestorIndexContext();
  const { isInternal } = useGlobal();
  const classes = useTableStyles();
  const investorIndexColumns = getInvestorIndexColumns(isInternal);
  const { investorAPI } = useAPIServiceContext();
  const isDesktop = useMediaQuery((t: Theme) => t.breakpoints.up("sm"));

  const downloadIndex = () => {
    investorAPI.getInvestorIndex().then((res) => {
      if (res?.success) {
        Utils.downloadFromBlob(res.data, "investors.xlsx");
      }
    });
  };

  return (
    <Paper elevation={5}>
      <Toolbar className={classes.filterToolbar}>
        <div className={classes.newButton}>
          <CanEdit>
            <Button
              component={RouterLink}
              variant="outlined"
              color="primary"
              className={classes.newButton}
              style={{ flex: 1 }}
              to={`/new-investor`}
            >
              New Investor
            </Button>
            &nbsp;
          </CanEdit>
          <Button
            variant="outlined"
            color="primary"
            onClick={downloadIndex}
            style={{ flex: 1 }}
          >
            Export
          </Button>
        </div>
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
        {isInternal && (
          <>
            <TextField
              select
              className={classes.filterActive}
              label="Inv Entity"
              variant="outlined"
              value={state?.entityFilter}
              onChange={(e: any) => setEntityFilter(e.target.value)}
            >
              <MenuItem value={"N"}>No</MenuItem>
              <MenuItem value={"Y"}>Yes</MenuItem>
              <MenuItem key="All" value="">
                All
              </MenuItem>
            </TextField>
            <TextField
              select
              className={classes.filterActive}
              label="Active"
              variant="outlined"
              value={state?.activeFilter}
              onChange={(e: any) => setActiveFilter(e.target.value)}
            >
              <MenuItem value={"Y"}>Yes</MenuItem>
              <MenuItem value={"N"}>No</MenuItem>
              <MenuItem key="All" value="">
                All
              </MenuItem>
            </TextField>
          </>
        )}
      </Toolbar>
      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {investorIndexColumns.map((headers: any, i: any) => (
                <TableCell
                  style={{ minWidth: headers.width }}
                  id={headers.accessor}
                  key={i}
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
            {transformedInvestors
              .slice(
                (state?.page || 0) * (state?.rowsPerPage || 25),
                (state?.page || 0) * (state?.rowsPerPage || 25) +
                  (state?.rowsPerPage || 25)
              )
              .map((investor: any, _i: any) => {
                return (
                  <TableRow key={investor.id}>
                    <TableCell>
                      <Link
                        variant="body2"
                        component={RouterLink}
                        to={`/investor/${investor.id}`}
                      >
                        {investor.name}
                      </Link>
                    </TableCell>
                    {isInternal && (
                      <>
                        <TableCell>
                          {investor.investmentEntity ? "Yes" : "No"}
                        </TableCell>
                        <TableCell>{investor.active ? "Yes" : "No"}</TableCell>
                      </>
                    )}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        labelRowsPerPage={isDesktop ? "Rows per page:" : ""}
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={transformedInvestors.length}
        rowsPerPage={state?.rowsPerPage || 25}
        page={state?.page || 0}
        onPageChange={setPage}
        onRowsPerPageChange={setRowsPerPage}
      />
    </Paper>
  );
};
