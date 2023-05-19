import React from "react";
import Fab from "@material-ui/core/Fab";
import SaveIcon from "@material-ui/icons/Save";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import { CircularProgress, makeStyles } from "@material-ui/core";
import { useForm } from "../form";
import { green, red } from "@material-ui/core/colors";
import clsx from "clsx";

interface Props {
  disabled?: boolean;
  postSaveAction?: any;
}

const useStyles = makeStyles(() => ({
  saveSuccess: {
    backgroundColor: green[500],
    "&:hover": {
      backgroundColor: green[700],
    },
  },
  saveError: {
    backgroundColor: red[500],
    "&:hover": {
      backgroundColor: red[700],
    },
  },
  saveProgress: {
    color: green[500],
    position: "absolute",
    top: -6,
    left: -6,
    zIndex: 1,
  },
}));

export const SaveButton = ({ disabled, postSaveAction }: Props) => {
  const {
    submitForm,
    successfulSubmission,
    preSubmission,
    failedSubmission,
    submitting,
  } = useForm();
  const classes = useStyles();

  const saveClassName = clsx({
    [classes.saveSuccess]: successfulSubmission(),
    [classes.saveError]: failedSubmission(),
  });
  return (
    <>
      <Fab
        disabled={disabled}
        aria-label="save"
        size="small"
        color="primary"
        className={saveClassName}
        onClick={async () => {
          await submitForm();
          if (postSaveAction) {
            postSaveAction();
          }
        }}
      >
        {preSubmission() && <SaveIcon />}
        {successfulSubmission() && <CheckIcon />}
        {failedSubmission() && <ClearIcon />}
      </Fab>
      {submitting && (
        <CircularProgress size={68} className={classes.saveProgress} />
      )}
    </>
  );
};
