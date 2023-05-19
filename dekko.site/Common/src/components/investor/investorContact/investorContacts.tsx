import React, { useEffect, useState } from "react";
import { Grid, Paper, Typography } from "@material-ui/core";
import _ from "lodash";
import { initialContact } from "../constants";
import { Contact } from "./contact";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { CanEdit } from "../../common";
import { useAPIServiceContext } from "../../global";
import { InvestorContactRecord } from "../../../utils/types";

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
export const InvestorContacts = (props: any) => {
  const investorId = props.investorId;
  const classes = useStyles();
  const { investorAPI } = useAPIServiceContext();
  const [contacts, setContacts] = useState<InvestorContactRecord[]>([]);
  const [newRow, setNewRow] = useState(false);

  const fetchContacts = () => {
    investorAPI.getInvestorContacts(investorId).then((res) => {
      if (res?.success) {
        setContacts(res.data);
        setNewRow(false);
      }
    });
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return (
    <>
      <Paper className={classes.root} elevation={3}>
        <Grid container spacing={3}>
          <Grid item xs={9}>
            <Typography
              className={classes.title}
              color="textSecondary"
              gutterBottom
            >
              Contacts
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
            <Grid item xs={12}>
              <Contact
                contact={initialContact}
                investorId={investorId}
                onSave={fetchContacts}
              />
            </Grid>
          )}
          {_.map(contacts, (contact: any, i: number) => (
            <Grid item xs={12} key={i}>
              <Contact
                contact={contact}
                investorId={investorId}
                onSave={fetchContacts}
              />
            </Grid>
          ))}
        </Grid>
      </Paper>
    </>
  );
};
