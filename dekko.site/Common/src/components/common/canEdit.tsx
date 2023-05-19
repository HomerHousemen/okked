import React from "react";
import { useGlobal, useAuth } from "../global";

export const CanEdit = (props: any) => {
  const { isInternal } = useGlobal();
  const { isReadOnly } = useAuth(isInternal);
  const readOnly = isReadOnly();
  return <>{!readOnly && props.children}</>;
};

export const ReadOnly = (props: any) => {
  const { isInternal } = useGlobal();
  const { isReadOnly } = useAuth(isInternal);
  const readOnly = isReadOnly();
  return <>{readOnly && props.children}</>;
};