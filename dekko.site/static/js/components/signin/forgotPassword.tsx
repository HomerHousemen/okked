import React from "react";
import { NavLink as Link } from "react-router-dom";
import { useExternalAuth, SigninState } from "@dekko/common";
import {
  InputLabel,
  Input,
  FormControl,
  Button,
  Box,
} from "@material-ui/core/";

export const ForgotPassword = (props: any) => {
  const { state, setUsername, setStatus, forgotPassword } = useExternalAuth();
  const onKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    // 'keypress' event misbehaves on mobile so we track 'Enter' key via 'keydown' event
    if (event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();
      forgotPassword();
    }
  };
  return (
    <>
      <h3 className="card-title">Forgot Password</h3>
      <div className="form-row">
        <FormControl className="col-md-12">
          <InputLabel htmlFor="username">Username</InputLabel>
          <Input
            autoFocus
            value={state?.username}
            id="username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </FormControl>
      </div>
      <form className="d-print-none">
        <Box mt={2} mb={3}>
          <Button
            onClick={(e) => forgotPassword()}
            variant="contained"
            color="primary"
          >
            Reset
          </Button>
        </Box>
        <div className="form-row">
          <Link
            to="#"
            className="nav-link"
            onClick={() => setStatus(SigninState.UserPass)}
          >
            Back
          </Link>
        </div>
      </form>
    </>
  );
};
