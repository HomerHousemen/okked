import React from "react";
import { useExternalAuth } from "@dekko/common";
import {
  InputLabel,
  Input,
  FormControl,
  Button,
  Box,
} from "@material-ui/core/";

export const TwoFactorForgot = (props: any) => {
  const { state, setTwoFactorForgot, setCode } = useExternalAuth();
  const onKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    // 'keypress' event misbehaves on mobile so we track 'Enter' key via 'keydown' event
    if (event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();
      setTwoFactorForgot();
    }
  };
  return (
    <>
      {" "}
      <h3 className="card-title">Forgot password</h3>
      <div>
        <div className="form-row">
          <div className="form-group col-md-6 form-field">
            <FormControl className="col-md-12">
              <InputLabel htmlFor="code">Authorization Code</InputLabel>
              <Input
                type="text"
                value={state?.code}
                id="code"
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={(e) => onKeyDown(e)}
              />
            </FormControl>
          </div>
        </div>
        <form className="d-print-none">
          <Box mt={2} mb={3}>
            <Button
              onClick={(e) => setTwoFactorForgot()}
              variant="contained"
              color="primary"
            >
              Submit
            </Button>
          </Box>
          <div className="form-row"></div>
        </form>
      </div>
    </>
  );
};
