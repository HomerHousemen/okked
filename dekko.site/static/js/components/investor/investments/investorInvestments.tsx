/** @format **/
import React from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Toolbar,
  Paper,
  Grid,
  useMediaQuery,
  Theme,
} from "@material-ui/core";
import { useAPIServiceContext, Utils, useTableStyles } from "@dekko/common";
import { KeyboardDatePicker } from "@material-ui/pickers";
import { useInvestorInvestments } from "./investorInvestmentsProvider";
import { InvestorInvestmentsColumns } from "./investorInvestmenColumns";
import NumberFormat from "react-number-format";
import moment from "moment/moment";

const shiftTzDateToPickerDate = (v: any) => {
  if (!v) return moment();
  return moment(v, "MM/DD/YYYY", true);
};

export const InvestorInvestments = () => {
  const { investorAPI } = useAPIServiceContext();
  const {
    setFilter,
    transformedInvestments,
    sortHandler,
    setPage,
    setRowsPerPage,
    state,
    setAsOfDate,
  } = useInvestorInvestments();
  // sort off of investmentId and investmentName and filter from those two.
  const classes = useTableStyles();
  const isDesktop = useMediaQuery((t: Theme) => t.breakpoints.up("sm"));

  const downloadInvestorInvestments = () => {
    investorAPI
      .getInvestorInvestments(
        state.investorId,
        moment(state.asOfDate).format("YYYYMMDD")
      )
      .then((res) => {
        if (res?.success) {
          Utils.downloadFromBlob(res.data, "investments.xlsx");
        }
      });
  };

  return (
    <>
      <Grid
        style={{ paddingBottom: "12px" }}
        container
        spacing={2}
        justifyContent="space-between"
        alignItems="center"
      >
        <Grid item xs={6} sm={3}>
          <KeyboardDatePicker
            autoOk
            format="MM/DD/YYYY"
            label="As Of Date"
            onChange={(date: any) => {
              let changedDate = shiftTzDateToPickerDate(date);
              if (changedDate.isValid()) setAsOfDate(changedDate);
            }}
            value={state?.asOfDate}
            fullWidth
          />
        </Grid>
        <Grid item xs={4} sm={1}>
          <Button
            variant="outlined"
            color="primary"
            onClick={downloadInvestorInvestments}
          >
            Export
          </Button>
        </Grid>
      </Grid>
      <Paper elevation={5}>
        <Toolbar className={classes.filterToolbar}>
          <TextField
            id="filter list"
            label="Filter"
            variant="outlined"
            value={state?.filter || ""}
            className={classes.filterInput}
            onChange={(event) => {
              setFilter(event.target.value);
            }}
          />
        </Toolbar>
        <TableContainer className={classes.tableContainer} component={Paper}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {InvestorInvestmentsColumns.map((headers: any, i: any) => (
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
              {transformedInvestments
                .slice(
                  (state?.page || 0) * (state?.rowsPerPage || 25),
                  (state?.page || 0) * (state?.rowsPerPage || 25) +
                    (state?.rowsPerPage || 25)
                )
                .map((investment: any, _i: any) => {
                  return (
                    <TableRow key={investment.investmentId}>
                      <TableCell>{investment.name}</TableCell>
                      <TableCell>
                        <NumberFormat
                          value={investment.capitalPercent}
                          decimalScale={7}
                          fixedDecimalScale={true}
                          displayType={"text"}
                        />
                      </TableCell>
                      <TableCell>
                        <NumberFormat
                          value={investment.profitPercent}
                          decimalScale={7}
                          fixedDecimalScale={true}
                          displayType={"text"}
                        />
                      </TableCell>
                      <TableCell>
                        <NumberFormat
                          value={investment.sweatPercent}
                          decimalScale={7}
                          fixedDecimalScale={true}
                          displayType={"text"}
                        />
                      </TableCell>
                      <TableCell>
                        {" "}
                        <NumberFormat
                          value={investment.commitment}
                          decimalScale={2}
                          fixedDecimalScale={true}
                          displayType={"text"}
                          thousandSeparator={true}
                          prefix={"$"}
                        />
                      </TableCell>
                      <TableCell>
                        {" "}
                        <NumberFormat
                          value={investment.amountCalled}
                          decimalScale={2}
                          fixedDecimalScale={true}
                          displayType={"text"}
                          thousandSeparator={true}
                          prefix={"$"}
                        />
                      </TableCell>
                      <TableCell>
                        {" "}
                        <NumberFormat
                          value={investment.amountDistributed}
                          decimalScale={2}
                          fixedDecimalScale={true}
                          displayType={"text"}
                          thousandSeparator={true}
                          prefix={"$"}
                        />
                      </TableCell>
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
          count={transformedInvestments.length}
          rowsPerPage={state?.rowsPerPage || 25}
          page={state?.page || 0}
          onPageChange={setPage}
          onRowsPerPageChange={setRowsPerPage}
        />
      </Paper>
    </>
  );
};
