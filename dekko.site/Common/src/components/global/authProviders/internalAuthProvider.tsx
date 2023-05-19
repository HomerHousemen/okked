import React, { createContext, useReducer, useContext } from "react";
import _ from "lodash";
import { useStoreContext } from "../../store/store";
import { useAxios } from "../../hooks";
import { useGlobal } from "../globalProvider";
import { InternalAuthContextTypes } from "./authTypes";

export const InternalAuthReducer = (state: any, action: any) => {
  switch (action.type) {
    case "SET_STATE":
      return action.value;
    /*    case "SET_USERNAME":
      return { ...state, username: action.value };*/
    case "SET_USER":
      return {
        ...state,
        user: action.value,
        username: action.username,
        signedIn: true,
      };
    case "SET_SIGN_IN":
      return { ...state, signIn: action.value };
    case "SET_SIGN_OUT":
      return { ...state, signOut: action.value };
    /*    case "SET_SIGNED_IN":
      return { ...state, signedIn: action.value };
    case "SET_SIGNING_IN":
      return { ...state, signingIn: action.value };*/
    default:
      return state;
  }
};

export const InternalAuthContext = createContext<
  Partial<InternalAuthContextTypes>
>({});

export const InternalAuthProvider = (props: any) => {
  const { loadStore } = useStoreContext();
  const [state, dispatch] = useReducer(InternalAuthReducer, {
    signedIn: false,
    signingIn: true,
    user: { restricted: true, admin: false, readonly: true },
    username: "",
  });
  const { setError, setSuccess, toggleLoader } = useGlobal();

  const setUsername = (username: any) => {
    dispatch({ type: "SET_USERNAME", value: username });
  };

  const signIn = () => {
    setSigningIn(true);
    dispatch({ type: "SET_SIGN_IN", value: (state.signIn || 0) + 1 });
  };

  const isSignedIn = () => {
    return state.signedIn ?? false;
  };
  const isReadOnly = () => {
    return state.user?.readOnly ?? true;
  };
  const isAdmin = () => {
    return state.user?.admin ?? false;
  };
  const isRestricted = () => {
    return state.user?.restricted ?? true;
  };

  function setUser(user: any) {
    dispatch({ type: "SET_USER", value: user, username: user.email });
  }

  const setSignedIn = (data: any) => {
    setSigningIn(false);
    if (data.success) {
      setUser(data.user);
      //   dispatch({type: "SET_USERNAME", value: data.user.email});
      //  dispatch({type: "SET_SIGNED_IN", value: true});

      setSuccess("Signed In Successful");

      loadStore();
      return;
    }
    setError(data.error);
  };
  function setSigningIn(bool: boolean) {
    dispatch({ type: "SET_SIGNING_IN", value: bool });
  }
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

  const setSignedOut = (data: any) => {
    if (data.success) {
      localStorage.setItem("signedIn", "false");
      dispatch({ type: "SET_SIGNED_IN", value: false });
      setSuccess("Signed Out Successful");
      return;
    }

    setError(data.error);
  };

  //if we don't have a user, call SignIn
  useAxios({
    method: "get",
    url: "/api/authentication/signin",
    trigger: state.signIn,
    callback: (data: any) => {
      setSignedIn(data);
    },
  });

  return (
    <InternalAuthContext.Provider
      value={{
        props: props,
        state: state,
        setUsername: setUsername,
        signIn: signIn,
        isSignedIn: isSignedIn,
        setSignedIn: setSignedIn,
        signOut: signOut,
        setSignedOut: setSignedOut,
        isReadOnly: isReadOnly,
        isAdmin: isAdmin,
        isRestricted: isRestricted,
      }}
    >
      {props.children}
    </InternalAuthContext.Provider>
  );
};
InternalAuthContext.displayName = "AuthorizationContext";
export const useInternalAuth = () => useContext(InternalAuthContext);
