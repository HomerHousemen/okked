import React, { useState } from "react";
import Button, { ButtonProps } from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Backdrop, makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  root: {
    marginLeft: 5,
  },
  backdrop: {
    position: "absolute",
    zIndex: 1,
  },
}));

interface Props extends ButtonProps {
  onClick: () => Promise<any>;
}

export const LoadingButton = ({ children, onClick, ...rest }: Props) => {
  const classes = useStyles();
  const [internalLoading, setInternalLoading] = useState(false);

  const isIconButton = rest.endIcon || rest.startIcon;

  const onClickWrapper = () => {
    setInternalLoading(true);
    onClick().finally(() => {
      setInternalLoading(false);
    });
  };

  const LoadingComponent = () => (
    <CircularProgress className={classes.root} size={20} />
  );

  if (!isIconButton) {
    return (
      <Button
        {...rest}
        style={{ position: "relative" }}
        onClick={onClickWrapper}
        disabled={internalLoading}
      >
        <Backdrop className={classes.backdrop} invisible open={internalLoading}>
          <LoadingComponent />
        </Backdrop>
        {children}
      </Button>
    );
  }

  const getStartIcon = () => {
    if (!rest.startIcon) return;
    return internalLoading ? <LoadingComponent /> : rest.startIcon;
  };

  const getEndIcon = () => {
    if (!rest.endIcon) return;
    return internalLoading ? <LoadingComponent /> : rest.endIcon;
  };

  return (
    <Button
      {...rest}
      onClick={onClickWrapper}
      disabled={internalLoading}
      startIcon={getStartIcon()}
      endIcon={getEndIcon()}
    >
      {children}
    </Button>
  );
};
