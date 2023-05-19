import React from "react";
import { Redirect } from "react-router-dom";
import { useExternalAuth, SigninState } from "@dekko/common";
import { MainLogin } from "./mainLogin";
import { TwoFactor } from "./twoFactor";
import { ForgotPassword } from "./forgotPassword";
import { TwoFactorForgot } from "./twoFactorForgot";
import { Container } from "@material-ui/core";

export const SignIn = () => {
  const { state } = useExternalAuth();

  const chooser = (status: SigninState) => {
    switch (status) {
      case SigninState.UserPass:
        return <MainLogin />;
      case SigninState.TwoFactor:
        return <TwoFactor />;
      case SigninState.ResetRequired:
        return <Redirect to="/resetPassword" />;
      case SigninState.ForgotPassword:
        return <ForgotPassword />;
      case SigninState.FPTwoFactor:
        return <TwoFactorForgot />;
      case SigninState.SignedIn:
        return <Redirect to="/investors" />;
      default:
        return <></>;
    }
  };

  return <Container maxWidth={"xs"}> {chooser(state.status)}</Container>;
};
