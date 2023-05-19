import _ from "lodash";
import React, { createContext, useContext, useState } from "react";
import { useAxios } from "../hooks";
import { useGlobal } from "../global";
export type FormTypes = {
  children?: React.ReactNode;
  initialValues: any;
  saveurl?: any;
  loadurl?: any;
  onSave?: (v: any) => void;
  initialSubmitted?: boolean;
  transformOutputFunction?: any;
  transformInputFunction?: any;
};

export type FormContextTypes = {
  values: any;
  errors: any;
  dirtyFields: any;
  submitting: boolean;
  saved: boolean;
  successfulSubmission: () => boolean;
  failedSubmission: () => boolean;
  preSubmission: () => boolean;

  onSave?: () => any;

  setValue: (field: any, v: any) => void;
  getValue: (field: any) => any;

  setError: (field: any, v: any) => void;
  getError: (field: any) => string;
  setErrorsFromServer: (errors: any) => void;
  setDirty: (field: any) => void;
  setAllDirty: (val?: boolean) => void;
  isDirty: (field: any) => boolean;
  canSubmit: () => void;
  submitForm: () => void;
  loadForm: () => void;
  loadurl?: string;
  saveurl?: string;
  setValues: any;
  reload: any;
};

export const DefaultFormContext: FormContextTypes = {
  values: {},
  errors: {},
  dirtyFields: {},
  submitting: false,
  saved: false,
  setValue: () => null,
  getValue: () => null,

  setError: () => null,
  setErrorsFromServer: () => null,

  getError: () => "",

  setDirty: () => null,
  setAllDirty: (_val?: any) => null,
  isDirty: () => false,
  canSubmit: () => false,
  submitForm: () => null,
  loadForm: () => null,

  successfulSubmission: () => false,
  failedSubmission: () => false,
  preSubmission: () => true,
  loadurl: "",
  saveurl: "",
  onSave: () => null,
  setValues: () => null,
  reload: () => null,
};

export const FormContext = createContext<FormContextTypes>(DefaultFormContext);

export const FormProvider: React.FC<FormTypes> = ({
  children,
  initialValues,
  saveurl,
  loadurl,
  onSave,
  initialSubmitted,
  transformOutputFunction,
  transformInputFunction,
}) => {
  const [values, setValues] = useState(initialValues || {});
  const [errors, setErrors] = useState<any>({});
  const [dirtyFields, setDirtyFields] = useState({});
  const [saveUrl, _setSaveUrl] = useState(saveurl || "");
  const [submitFormTrigger, setSubmitFormTrigger] = useState();
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [submitted, setSubmitted] = useState(initialSubmitted || false);
  const [loadUrl, _setLoadUrl] = useState(loadurl || "");
  const [loadFormTrigger, setLoadFormTrigger] = useState();
  const [data, setData] = useState(initialValues);
  const { toggleLoader, showErrorMsg } = useGlobal();
  const updateWith = (oldValue: any, field: string, value: any) => {
    let newValue = { ...oldValue };
    if (value === "" || !value) {
      newValue = _.omit(newValue, [field]);
    } else {
      newValue[field] = value;
    }
    return newValue;
  };

  useAxios({
    method: "post",
    url: `api/${saveUrl}`,
    options: data,
    trigger: submitFormTrigger,
    callback: (res: any) => {
      setSubmitted(true);
      setSubmitting(false);
      if (res.success) {
        setErrors({});
        setSaved(true);
        if (onSave) onSave({ ...res.data, initialSubmitted: true });
      } else {
        if(res.errors)
          setErrors(res.errors);
        if (res.errorMsg) {
          showErrorMsg(res.errorMsg);
        }
      }
    },
  });

  useAxios({
    method: "get",
    url: `api/${loadUrl}`,
    trigger: loadFormTrigger,
    callback: (res: any) => {
      toggleLoader(false);
      if (res.success) {
        if(res.data)
          setValues(res.data);
        if (transformInputFunction) {
          let v = transformInputFunction(res.data);
          setValues(v);
        }
      }
    },
  });
  const successfulSubmission = () =>
    submitted && !submitting && _.isEmpty(errors);

  const preSubmission = () => !submitting && !submitted;

  const failedSubmission = () => submitted && !submitting && !_.isEmpty(errors);

  let submitForm = () => {
    setAllDirty();
    setData(transformOutputFunction ? transformOutputFunction(values) : values);
    canSubmit() && setSubmitFormTrigger((prev: any) => (prev || 0) + 1);
  };

  const loadForm = () => {
    toggleLoader(true);
    setLoadFormTrigger((prev: any) => (prev || 0) + 1);
  };
  let setValue = (field: any, v: any) => {
    setSubmitted(false);
    setValues((vs: any) => updateWith(vs, field, v));
  };

  let getValue = (field: any) => (!values ? undefined : values[field]);

  let setError = (field: any, err: any) => {
    setErrors((errs: any) => updateWith(errs, field, err));
  };

  let getError = (field: any) => (errors[field] ? errors[field] : "");

  let setDirty = (field: any) =>
    setDirtyFields((df) => updateWith(df, field, true));

  let getDirty = (field: any) => Object.keys(dirtyFields).includes(field);

  let setAllDirty = (val: any = true) =>
    Object.keys(values).map((field) =>
      setDirtyFields((df) => updateWith(df, field, val))
    );

  let setErrorsFromServer = (errs: any) =>
    setErrors((prevState: any) => ({ ...prevState, ...errs }));

  let canSubmit = () => _.isEmpty(errors);

  let reload = () => setValues({ ...values });
  let form = {
    values: values,
    errors: errors,
    dirtyFields: dirtyFields,

    setValue: setValue,
    getValue: getValue,
    setErrorsFromServer: setErrorsFromServer,
    setError: setError,
    getError: getError,
    setErrors: setErrorsFromServer,

    setDirty: setDirty,
    setAllDirty: setAllDirty,
    isDirty: getDirty,
    canSubmit: canSubmit,

    submitForm: submitForm,
    loadForm: loadForm,
    successfulSubmission: successfulSubmission,
    failedSubmission: failedSubmission,
    preSubmission: preSubmission,
    submitting: submitting,
    saved: saved,
    setValues: setValues,
    reload: reload,
  };

  return (
    <>
      <FormContext.Provider value={form}>{children}</FormContext.Provider>
    </>
  );
};

export const useForm = () => useContext(FormContext);
