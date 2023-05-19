import React from "react";
import { useAuth, useGlobal } from "../global";

export const IsAdmin = (props: any) => {
  const { isInternal } = useGlobal();
  const authFns = useAuth(isInternal);
  const admin = authFns?.isAdmin();
  return <>{admin && props.children}</>;
};
