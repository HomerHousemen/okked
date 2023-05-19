import React, { useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import { useForm } from "./formProvider";

type TextInputTypes = {
  onValidate?: (v: any) => any;
  name: string;
  label?: string;
  textFieldProps?: {};
};

export const TextInputField: React.FC<TextInputTypes> = ({
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
        onChange={(event) => form.setValue(name, event.target.value)}
        error={error ? true : false}
        helperText={ error ? error : null}
        fullWidth
        {...textFieldProps}
      />
    </div>
  );
};
