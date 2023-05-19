import React, { useState } from "react";
import { Grid } from "@material-ui/core";
import { Button } from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
import _ from "lodash";
import {CanEdit, InternalOnly, LastUpdated} from "../../common";
import {
  useForm,
  TextInputField,
  PhoneInputField,
  CheckboxField,
} from "../../form";
import { useGlobal } from "../../global";
import { useAxios } from "../../hooks";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    margin: theme.spacing(3),
    padding: theme.spacing(2),
  },
  title: {
    fontSize: 24,
  },
  button: {
    margin: theme.spacing(1),
  },
}));

export const ContactForm = (props: any) => {
  const [deleteContact, setDelete] = useState(false);
  const { setSuccess } = useGlobal();
  const classes = useStyles();
  const { values, submitForm, getValue } = useForm();

  //todo move to investor API
  useAxios({
    method: "delete",
    url: `/api/investor/contacts/${values?.id}`,
    trigger: deleteContact,
    callback: (data: any) => {
      if (data.success) {
        setSuccess("Contact Successfully Deleted");
        props.onDelete();
      }
    },
  });
  return (
    <>
      <hr />
      <Grid container item xs={12} spacing={3}>
        <Grid item xs={12}>
          <TextInputField
            name="contactName"
            label="Contact Name"
            onValidate={(_v) => ""}
          />
        </Grid>
        <Grid item xs={6}>
          <PhoneInputField
            name="primaryPhone"
            label="Primary Phone"
            onValidate={(_v) => ""}
          />
        </Grid>
        <Grid item xs={6}>
          <PhoneInputField
            name="secondaryPhone"
            label="Secondary Phone"
            onValidate={(_v) => ""}
          />
        </Grid>
        <Grid item xs={12}>
          <TextInputField
            name="email"
            label="Primary Email"
            onValidate={(v) => (!v ? "Required" : "")}
          />
        </Grid>
        <InternalOnly>
        <Grid item xs={6}>
          <CheckboxField name="emailMemos" label="Email Memos" />
        </Grid>
        <Grid item xs={6}>
          <CheckboxField name="emailFiles" label="Email Files" />
        </Grid>
        
        <Grid item xs={12}>
          <CanEdit>
            <Button
              className={classes.button}
              variant="outlined"
              color="primary"
              onClick={() => submitForm()}
            >
              Update
            </Button>
            {values?.id > 0 && (
              <Button
                className={classes.button}
                variant="outlined"
                color="primary"
                onClick={() => {
                  confirm(
                    "Are you sure you want to permanently delete this record?"
                  ) && setDelete(true);
                }}
              >
                Delete
              </Button>
            )}
          </CanEdit>
        </Grid>
       
        <LastUpdated
          LastUpdated={getValue("lastUpdated")}
          UpdatedBy={getValue("updatedBy")}
        />
         </InternalOnly>
      </Grid>
    </>
  );
};
