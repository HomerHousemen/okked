import React, { createContext, useReducer, useContext, useEffect } from "react";
import _ from "lodash";
import { useStoreContext } from "../../store";
import { useAxios } from "../../hooks";
import { useGlobal } from "../globalProvider";
import { ExternalAuthContextTypes, SigninState } from "./authTypes";
import {
  localStorageGet,
  LocalStorageKeys,
  localStorageRemove,
  localStorageSet,
} from "../../../utils/localStorageService";


export const ExternalAuthReducer = (state: any, action: any) => {
  switch (action.type) {
    case "SET_USERNAME":
      return { ...state, username: action.value, signedIn: false };
    case "SET_PASSWORD":
      return { ...state, password: action.value };
    case "SET_CODE":
      return { ...state, code: action.value };
    case "SET_2FACTOR":
      return { ...state, twoFactor: action.value };
    case "SET_2FACTOR_FORGOT":
      return { ...state, twoFactorForgot: action.value };
    case "SET_STATUS":
      return { ...state, status: action.value };
    case "SET_NEW_PASSWORD1":
      return { ...state, newPassword1: action.value };
    case "SET_NEW_PASSWORD2":
      return { ...state, newPassword2: action.value };
    case "SET_SIGN_IN":
      return { ...state, signIn: action.value };
    case "SET_SIGN_OUT":
      return { ...state, signOut: action.value };
    case "SET_RESET_REQUIRED":
      return { ...state, resetRequired: action.value };
    case "RESET_PASSWORD":
      return { ...state, resetTrigger: (state.resetTrigger || 0) + 1 };
    case "FORGOT_PASSWORD":
      return { ...state, forgotTrigger: (state.forgotTrigger || 0) + 1 };
    default:
      return state;
  }
};

export const ExternalAuthContext = createContext<
  Partial<ExternalAuthContextTypes>
>({});

export const ExternalAuthProvider = (props: any) => {
  const { loadStore } = useStoreContext();
  
  const [state, dispatch] = useReducer(ExternalAuthReducer, {
    username: localStorageGet(LocalStorageKeys.username) || "",
    password: "",
    newPassword1: "",
    newPassword2: "",
    code: "",
    status: SigninState.UserPass,
    isResetRequired: false,
  });
  const { setError, setSuccess, toggleLoader } = useGlobal();
  const globalState = useGlobal().state;

  const setUsername = (username: any) => {
    dispatch({ type: "SET_USERNAME", value: username });
  };

  const setPassword = (password: any) => {
    dispatch({ type: "SET_PASSWORD", value: password });
  };
  const setNewPassword1 = (password: any) => {
    dispatch({ type: "SET_NEW_PASSWORD1", value: password });
  };
  const setNewPassword2 = (password: any) => {
    dispatch({ type: "SET_NEW_PASSWORD2", value: password });
  };
  const setCode = (code: any) => {
    dispatch({ type: "SET_CODE", value: code });
  };
  const setStatus = (state: any) => {
    dispatch({ type: "SET_STATUS", value: state });
  };

  const setResetRequired = (state: any) => {
    dispatch({ type: "SET_RESET_REQUIRED", value: state });
  };

  // sign in
  useAxios({
    method: "post",
    url: "/api/authentication/login",
    options: { username: state.username, password: state.password },
    trigger: state.signIn,
    callback: (data: any) => {
      toggleLoader(false);
      if (data.success) {
        setCode("");
        setStatus(SigninState.TwoFactor);
        setResetRequired(data.resetRequired);
      } else {
        setError(data.message);
      }
    },
  });

  useAxios({
    method: "post",
    url: "/api/authentication/resetPassword",
    options: { username: state.username, password: state.newPassword1 },
    trigger: state.resetTrigger,
    callback: (data: any) => {
      toggleLoader(false);
      if (data.success) {
        setCode("");
        setResetRequired(false);
        setPassword("");
        setNewPassword1("");
        setNewPassword2("");
        setStatus(SigninState.UserPass);
        setSuccess("Password changed");
      } else {
        setError(data.message);
      }
    },
  });
  useAxios({
    method: "post",
    url: "/api/authentication/twoFactor",
    options: { username: state.username, password: state.code },
    trigger: state.twoFactor,
    callback: (data: any) => {
      toggleLoader(false);
      if (data.success) {
        setSignedIn({ ...data, username: state.username });
      } else {
        setError(data.message);
      }
    },
  });

  useAxios({
    method: "post",
    url: "/api/authentication/twoFactorForgot",
    options: { username: state.username, password: state.code },
    trigger: state.twoFactorForgot,
    callback: (data: any) => {
      toggleLoader(false);
      if (data.success) {
        setCode("");
        setResetRequired(false);
        setPassword("");
        setStatus(SigninState.UserPass);
        setSuccess("Check your email for login information");
      } else {
        setError(data.message);
      }
    },
  });
  useAxios({
    method: "post",
    url: "/api/authentication/forgotPassword",
    options: { username: state.username },
    trigger: state.forgotTrigger,
    callback: (data: any) => {
      toggleLoader(false);
      if (data.success) {
        setCode("");
        setStatus(SigninState.FPTwoFactor);
      } else {
        setError(data.message);
      }
    },
  });

  const signIn = () => {
    toggleLoader(true);
    dispatch({ type: "SET_SIGN_IN", value: (state.signIn || 0) + 1 });
  };

  const isSignedIn = () => {
    const localIsSignedIn = localStorageGet(LocalStorageKeys.isSignedIn);
    const username = localStorageGet(LocalStorageKeys.username);
    return localIsSignedIn && username;
  };

  const isReadOnly = () => {
    return state.user?.readOnly ?? true;
  };
  const setTwoFactor = () => {
    dispatch({ type: "SET_2FACTOR", value: (state.twoFactor || 0) + 1 });
  };
  const setTwoFactorForgot = () => {
    dispatch({
      type: "SET_2FACTOR_FORGOT",
      value: (state.twoFactorForgot || 0) + 1,
    });
  };

  const setSignedIn = (data: {
    success: boolean;
    username: string;
    error: any;
  }) => {
    if (data.success) {
      localStorageSet(LocalStorageKeys.isSignedIn, true, true);
      localStorageSet(LocalStorageKeys.username, data.username, true);
      dispatch({ type: "SET_PASSWORD", value: "" });
      dispatch({ type: "SET_CODE", value: "" });
      dispatch({ type: "SET_STATUS", value: SigninState.SignedIn });
      setSuccess("Signed In Successful");

      loadStore();
      return;
    }

    setError(data.error);
  };

  //sign out
  useAxios({
    method: "post",
    url: "/api/authentication/signout",
    trigger: state.signOut,
    callback: (data: any) => {
      toggleLoader(false);
      setSignedOut(data);
    },
  });

  const signOut = () => {
    toggleLoader(true);
    dispatch({ type: "SET_SIGN_OUT", value: (state.signOut || 0) + 1 });
  };

  const resetPassword = () => {
    if (state.newPassword1 != state.newPassword2) {
      alert("Passwords must match");
      return;
    }
    dispatch({ type: "RESET_PASSWORD" });
  };

  const forgotPassword = () => {
    dispatch({ type: "FORGOT_PASSWORD" });
  };

  const setSignedOut = (data: any) => {
    if (data.success) {
      setStatus(SigninState.UserPass);
      setUsername("");
      localStorageRemove(LocalStorageKeys.username);
      setSuccess("Signed Out Successfully");
      localStorageRemove(LocalStorageKeys.isSignedIn);
      return;
    }

    setError(data.error);
  };

  useEffect(() => {
    if (!_.isNil(globalState.unauthorized)) {
      setStatus(SigninState.UserPass);
      setError("Your token has expired.  Please Sign In.");
    }
    if (isSignedIn()) {
      loadStore();
    }
  }, [globalState.unauthorized]);

  return (
    <ExternalAuthContext.Provider
      value={{
        props: props,
        state: state,
        setUsername: setUsername,
        setPassword: setPassword,
        signIn: signIn,
        isSignedIn: isSignedIn,
        setSignedIn: setSignedIn,
        signOut: signOut,
        setSignedOut: setSignedOut,
        setCode: setCode,
        setTwoFactor: setTwoFactor,
        isReadOnly: isReadOnly,
        resetPassword: resetPassword,
        setNewPassword1: setNewPassword1,
        setNewPassword2: setNewPassword2,
        setStatus: setStatus,
        forgotPassword: forgotPassword,
        setTwoFactorForgot: setTwoFactorForgot,
      }}
    >
      {props.children}
    </ExternalAuthContext.Provider>
  );
};
ExternalAuthContext.displayName = "AuthorizationContext";
export const useExternalAuth = () => useContext(ExternalAuthContext);
