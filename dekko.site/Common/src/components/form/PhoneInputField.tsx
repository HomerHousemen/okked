import React, { useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import { useForm } from "./formProvider";
import { PhoneMask } from "../masks";

type PhoneInputTypes = {
  onValidate?: (v: any) => any;
  name: string;
  label: string;
  textFieldProps?: {};
};

export const PhoneInputField: React.FC<PhoneInputTypes> = ({
  name,
  label,
  onValidate,
  textFieldProps,
}) => {
  const form = useForm();

  let value = form.getValue(name);
  let error = form.getError(name);

  useEffect(() => {
    if (onValidate) {
      form.setError(name, onValidate(value));
    }
  }, [value]);

  return (
    <div className="input-field">
      <TextField
        label={label}
        onBlur={() => form.setDirty(name)}
        value={value || ""}
        onChange={(event) => {
          form.setValue(name, event.target.value);
        }}
        error={!!(error)}
        helperText={error ? error : null}
        InputProps={{
          inputComponent: PhoneMask,
        }}
        fullWidth
        {...textFieldProps}
      />
    </div>
  );
};
