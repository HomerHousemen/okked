import React from "react";
import { Backdrop, makeStyles, CircularProgress } from "@material-ui/core";
import { useGlobal } from "../global";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    position: "absolute",
    zIndex: theme.zIndex.drawer + 1,
  },
}));

interface Props {
  isLoading?: boolean;
}

export const Loader = ({ isLoading }: Props) => {
  const classes = useStyles();
  const { state } = useGlobal();

  // if provided, use isLoading boolean from props
  // if not provided, fallback to the global loading state
  let loaderStatusToApply;
  if (isLoading !== undefined) {
    loaderStatusToApply = isLoading;
  } else {
    loaderStatusToApply = state.loading;
  }

  return (
    <Backdrop className={classes.backdrop} open={loaderStatusToApply}>
      <CircularProgress />
    </Backdrop>
  );
};
