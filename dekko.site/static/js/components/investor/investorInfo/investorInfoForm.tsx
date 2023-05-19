import React from "react";
import { Typography, Paper, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { TextInputField, SelectField } from "@dekko/common";
import { useStoreContext } from "@dekko/common";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  title: {
    fontSize: 24,
  },
  button: {
    margin: theme.spacing(1),
  },
}));

export const InvestorInfoForm = () => {
  const classes = useStyles();
  const { state: storeState } = useStoreContext();

  return (
    <Paper className={classes.root} elevation={3}>
      <Grid container spacing={3} className="root">
        <Grid item xs={12}>
          <Typography
            className={classes.title}
            color="textSecondary"
            gutterBottom
          >
            Investor Info
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <TextInputField
            name="name"
            label="Investor Name"
            onValidate={(v) => (!v ? "Required" : "")}
          />
        </Grid>

        <Grid item xs={6}>
          <SelectField
            name="federalTypeId"
            label="Federal Type"
            selectList={storeState?.lookups?.federalTypes}
          />
        </Grid>
        <Grid item xs={6}></Grid>
      </Grid>
    </Paper>
  );
};
