import React from "react";
import { useExternalAuth } from "@dekko/common";
import {
  InputLabel,
  Input,
  FormControl,
  Button,
  Box,
} from "@material-ui/core/";

export const TwoFactor = (props: any) => {
  const { state, setTwoFactor, setCode } = useExternalAuth();
  const onKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    // 'keypress' event misbehaves on mobile so we track 'Enter' key via 'keydown' event
    if (event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();
      setTwoFactor();
    }
  };
  return (
    <>
      <h3 className="card-title">Sign In</h3>
      <div className="form-row">
        <FormControl className="col-md-12">
          <InputLabel htmlFor="code">Authorization Code</InputLabel>
          <Input
            autoFocus
            type="text"
            value={state?.code || ""}
            id="code"
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => onKeyDown(e)}
          />
        </FormControl>
      </div>
      <form className="d-print-none">
        <Box mt={2} mb={3}>
          <Button
            onClick={(e) => setTwoFactor()}
            variant="contained"
            color="primary"
          >
            Submit
          </Button>
        </Box>
        <div className="form-row"></div>
      </form>
    </>
  );
};
