import React from "react";
import { Redirect } from "react-router-dom";
import { useExternalAuth } from "@dekko/common";
import {
  InputLabel,
  Input,
  FormControl,
  Button,
  Box,
  Container,
} from "@material-ui/core/";

export const ResetPassword = (props: any) => {
  const { state, isSignedIn, resetPassword, setNewPassword1, setNewPassword2 } =
    useExternalAuth();
  const onKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    // 'keypress' event misbehaves on mobile so we track 'Enter' key via 'keydown' event
    if (event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();
      resetPassword();
    }
  };

  if (!isSignedIn()) {
    return <Redirect to="#" />;
  }

  return (
    <Container maxWidth={"xs"}>
      <h3 className="card-title">Change Password</h3>
      <div className="form-row">
        <FormControl className="col-md-12">
          <InputLabel htmlFor="Password">New Password</InputLabel>
          <Input
            autoFocus
            type="password"
            value={state?.newPassword1}
            id="password1"
            onChange={(e) => setNewPassword1(e.target.value)}
          />
        </FormControl>
      </div>
      <div className="form-row">
        <FormControl className="col-md-12">
          <InputLabel htmlFor="password">Reenter Password</InputLabel>
          <Input
            type="password"
            value={state?.newPassword2}
            id="password2"
            onChange={(e) => setNewPassword2(e.target.value)}
            onKeyDown={(e) => onKeyDown(e)}
          />
        </FormControl>
      </div>
      <form className="d-print-none">
        <Box mt={2} mb={3}>
          <Button
            onClick={(e) => resetPassword()}
            variant="contained"
            color="primary"
          >
            Submit
          </Button>
        </Box>
        <div className="form-row"></div>
      </form>
    </Container>
  );
};
