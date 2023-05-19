import React, { useEffect } from "react";
import { useGlobal } from "../global";
import { ToastContainer, toast } from "react-toastify";
import _ from "lodash";

export const FlashMessage = () => {
  const { state, setSuccess, setError } = useGlobal();

  useEffect(() => {
    if (!_.isUndefined(state.success) && !toast.isActive(state.success)) {
      toast.success(state.success, {
        toastId: state.success,
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      setSuccess(undefined);
    }
  }, [state.success]);

  useEffect(() => {
    if (!_.isUndefined(state.error) && !toast.isActive(state.error)) {
      toast.error(state.error, {
        toastId: state.error,
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      setError(undefined);
    }
  }, [state.error]);

  return <ToastContainer className={"d-print-none"} />;
};
