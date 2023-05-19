import React, { useState } from "react";
import { NavLink as Link, Redirect } from "react-router-dom";
import { useExternalAuth, SigninState } from "@dekko/common";
import {
  InputLabel,
  Input,
  FormControl,
  Button,
  Box,
} from "@material-ui/core/";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { IconButton, InputAdornment, TextField } from "@material-ui/core";

export const MainLogin = (props: any) => {
  const { state, setUsername, setPassword, signIn, setStatus } =
    useExternalAuth();
  const [tempUsername, setTempUsername] = useState(state?.username || "");
  const [tempPassword, setTempPassword] = useState(state?.password || "");

  const handleSignIn = () => {
    setUsername(tempUsername);
    setPassword(tempPassword);
    signIn();
  };
  const onKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    // 'keypress' event misbehaves on mobile so we track 'Enter' key via 'keydown' event
    if (event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();
      handleSignIn();
    }
  };
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);
  return (
    <>
      <h3 className="card-title">Sign In</h3>
      <div>
        <div className="form-row">
          <FormControl className="col-md-12">
            <InputLabel htmlFor="username">Username</InputLabel>
            <Input
              autoFocus
              value={tempUsername}
              id="username"
              onChange={(e) => setTempUsername(e.target.value)}
            />
          </FormControl>
        </div>
      </div>
      <div className="form-row">
        <FormControl className="col-md-12">
          <InputLabel htmlFor="password">Password</InputLabel>
          <Input
            type={showPassword ? "text" : "password"}
            value={tempPassword}
            id="password"
            onChange={(e) => setTempPassword(e.target.value)}
            onKeyDown={(e) => onKeyDown(e)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
      </div>
      <form className="d-print-none">
        <Box mt={2} mb={3}>
          <Button onClick={handleSignIn} variant="contained" color="primary">
            Sign In
          </Button>
        </Box>
        <div className="form-row">
          <Link
            to="#"
            className="nav-link"
            onClick={() => setStatus(SigninState.ForgotPassword)}
          >
            Forgot Password
          </Link>
        </div>
      </form>
    </>
  );
};
