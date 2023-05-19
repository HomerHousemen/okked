import React, { useEffect, useState } from "react";
import { Grid, Paper, Typography } from "@material-ui/core";
import _ from "lodash";
import { initialAddress } from "../constants";
import { Address } from "./address";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { CanEdit } from "../../common";
import { useAPIServiceContext } from "../../global";
import { InvestorAddressRecord } from "../../../utils/types";

const useStyles = makeStyles((theme) => ({
  container: {
    maxWidth: "800px",
  },
  root: {
    padding: theme.spacing(2),
  },
  title: {
    fontSize: 24,
  },
  buttons: {
    textAlign: "right",
    margin: theme.spacing(1),
    padding: theme.spacing(2),
  },
  button: {
    margin: theme.spacing(1),
  },
}));
export const InvestorAddresses = (props: any) => {
  const investorId = props.investorId;
  const classes = useStyles();
  const { investorAPI } = useAPIServiceContext();
  const [addresses, setAddresses] = useState<InvestorAddressRecord[]>([]);
  const [newRow, setNewRow] = useState(false);

  const fetchAddresses = () => {
    investorAPI.getInvestorAddresses(investorId).then((res) => {
      if (res?.success) {
        setAddresses(res.data);
        setNewRow(false);
      }
    });
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  return (
    <>
      <Paper className={classes.root} elevation={3}>
        <Grid container item xs={12} spacing={3}>
          <Grid item xs={9}>
            <Typography
              className={classes.title}
              color="textSecondary"
              gutterBottom
            >
              Addresses
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <CanEdit>
              <Button
                variant="outlined"
                color="primary"
                className={classes.button}
                style={{ flex: 1 }}
                onClick={(_e) => setNewRow(!newRow)}
              >
                {newRow ? `Cancel` : `Add`}
              </Button>
            </CanEdit>
          </Grid>
          {newRow && (
            <CanEdit>
              <Grid item xs={12}>
                <Address
                  address={initialAddress}
                  investorId={investorId}
                  onSave={fetchAddresses}
                />
              </Grid>
            </CanEdit>
          )}
          {_.map(addresses, (address: any, i: number) => (
            <Grid item xs={12} key={i}>
              <Address
                address={address}
                investorId={investorId}
                key={i}
                onSave={fetchAddresses}
              />
            </Grid>
          ))}
        </Grid>
      </Paper>
    </>
  );
};
