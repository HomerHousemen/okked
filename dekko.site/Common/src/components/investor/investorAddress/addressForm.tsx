import React, { useState } from "react";
import { Grid } from "@material-ui/core";
import { Button } from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
import {STATES, CanEdit, LastUpdated, InternalOnly} from "../../common";
import {
  useForm,
  SelectField,
  TextInputField,
  //ZipCodeInputField,
} from "../../form";
import { useGlobal } from "../../global";
import { useAxios } from "../../hooks";
import { useStoreContext } from "../../store";

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
export const AddressForm = (props: any) => {
  const [deleteAddress, setDelete] = useState(false);
  const { setSuccess } = useGlobal();
  const classes = useStyles();
  const { state: storeState } = useStoreContext();
  const { values, getValue, submitForm } = useForm();

  //todo move to investor API
  useAxios({
    method: "delete",
    url: `/api/investor/addresses/${values?.id}`,
    trigger: deleteAddress,
    callback: (data: any) => {
      if (data.success) {
        setSuccess("Address Successfully Deleted");
        props.onDelete();
      }
    },
  });
  return (
    <>
      <hr />
      <Grid container item xs={12} spacing={3}>
        <Grid item xs={12}>
          <SelectField
            name="addressType"
            label="Address Type"
            selectList={storeState.lookups?.addressTypes}
            onValidate={(v) => (!v ? "Required" : "")}
          />
        </Grid>

        <Grid item xs={12}>
          <TextInputField
            name="streetAddress"
            label="Street Address"
            onValidate={(v) => (!v ? "Required" : "")}
          />
        </Grid>
        <Grid item xs={6}>
          <TextInputField
            name="city"
            label="City"
            onValidate={(v) => (!v ? "Required" : "")}
          />
        </Grid>
        <Grid item xs={6}>
          <SelectField
            name="state"
            label="State"
            selectList={STATES}
            //onValidate={(v) => (!v ? "Required" : "")}
          />
        </Grid>
        <Grid item xs={6}>
          <TextInputField
            name="zipCode"
            label="Zip Code"
            onValidate={(v) => (!v ? "Required" : "")}
          />
        </Grid>
        <Grid item xs={6}>
          <SelectField
            name="countryCode"
            label="Country"
            selectList={storeState.lookups?.countries}
            onValidate={(v) => (!v ? "Required" : "")}
          />
        </Grid>
        <InternalOnly>
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
