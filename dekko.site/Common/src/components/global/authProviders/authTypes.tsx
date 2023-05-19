export type ExternalAuthContextTypes = {
  props: any;
  state: any;
  setUsername: any;
  setPassword: any;
  signIn: any;
  isSignedIn: any;
  setSignedIn: any;
  signOut: any;
  setSignedOut: any;
  isReadOnly: any;
  setCode: any;
  setTwoFactor: any;
  resetPassword: any;
  setNewPassword1: any;
  setNewPassword2: any;
  setStatus: any;
  forgotPassword: any;
  setTwoFactorForgot: any;
};

export type InternalAuthContextTypes = {
  props: any;
  state: any;
  setUsername: any;
  signIn: any;
  isSignedIn: any;
  setSignedIn: any;
  signOut: any;
  setSignedOut: any;
  isAdmin: any;
  isReadOnly: any;
  isRestricted: any;
};

export enum SigninState {
  UserPass,
  TwoFactor,
  ResetRequired,
  ForgotPassword,
  FPTwoFactor,
  SignedIn,
}
