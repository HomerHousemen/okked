import React, { useEffect } from "react";
import { useReport } from "./investorReportProvider";
import {
  Button,
  TextField,
  MenuItem,
  Grid,
  useMediaQuery,
  makeStyles,
  createStyles,
  Theme,
} from "@material-ui/core";
import { KeyboardDatePicker } from "@material-ui/pickers";
import _ from "lodash";
import moment from "moment";
import { PrintButton, ReportViewer } from "@dekko/common";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    buttons: {
      padding: theme.spacing(2),
      marginTop: theme.spacing(1),
      textAlign: "center",
      verticalAlign: "middle",
    },
    formElementStyle: {
      width: "100%",
      height: "100%",
    },
    buttonStyle: {
      marginTop: theme.spacing(1),
      marginLeft: theme.spacing(2),
    },
  })
);

const shiftTzDateToPickerDate = (v: any) => {
  if (!v) return "";

  const date = moment(v).format("YYYY-MM-DD");
  return moment.utc(date);
};

export const InvestorReports = (props: any) => {
  const {
    state,
    setReportType,
    setInvestor,
    setStartDate,
    setEndDate,
    generateReport,
    exportReport,
  } = useReport();
  const classes = useStyles();
  const isDesktop = useMediaQuery((t: Theme) => t.breakpoints.up("sm"));

  useEffect(() => {
    setInvestor(props.investorId);
    setReportType(1);
  }, []);

  const report = _.find(
    state?.reportTypes,
    (report) => report.id === state?.reportType
  );
  const label = report?.type == "AsOfDate" ? "As Of Date" : "End Date";

  return (
    <>
      <div className={"d-print-none"}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={3}>
            <TextField
              select
              label="Report"
              onChange={(e) => setReportType(e.target.value)}
              className={classes.formElementStyle}
              name={"reportType"}
              value={state?.reportType}
            >
              {_.map(state?.reportTypes, (option: any) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          {report?.type !== "AsOfDate" && (
            <Grid item xs={6} sm={2}>
              <KeyboardDatePicker
                autoOk
                format="MM/DD/YYYY"
                label="Start Date"
                onChange={(date: any) => {
                  let changedDate = shiftTzDateToPickerDate(date);
                  setStartDate(changedDate);
                }}
                value={state?.startDate}
                fullWidth
              />
            </Grid>
          )}
          <Grid item xs={6} sm={2}>
            <KeyboardDatePicker
              autoOk
              format="MM/DD/YYYY"
              label={label}
              onChange={(date: any) => {
                let changedDate = shiftTzDateToPickerDate(date);
                setEndDate(changedDate);
              }}
              value={state?.endDate}
              fullWidth
            />
          </Grid>
          <Grid item xs={5} className={classes.buttons}>
            <Grid
              container
              spacing={3}
              justifyContent={isDesktop ? "flex-end" : undefined}
            >
              <Grid item>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    generateReport();
                  }}
                  variant="contained"
                  color="primary"
                >
                  Generate
                </Button>
              </Grid>
              <Grid item>
                <PrintButton />
              </Grid>
              <Grid item>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    exportReport();
                  }}
                  variant="contained"
                  color="primary"
                >
                  Export
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
      <ReportViewer state={state} />
    </>
  );
};
