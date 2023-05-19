import React, { useEffect } from "react";
import { TextField, MenuItem } from "@material-ui/core";
import { useForm } from "./formProvider";

type SelectFieldTypes = {
  onValidate?: (v: any) => any;
  name: string;
  label?: string;
  textFieldProps?: {};
  selectList: {
    id: string | number;
    name: string;
    active?: boolean | undefined;
  }[];
};

export const SelectField: React.FC<SelectFieldTypes> = ({
  name,
  label,
  onValidate,
  textFieldProps,
  selectList,
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
        select
        label={label}
        name={name}
        onBlur={() => form.setDirty(name)}
        onChange={(event) => {
          form.setValue(name, event.target.value);
        }}
        value={value || ""}
        fullWidth
        error={error ? true : false}
        // @ts-ignore
        helperText={error ? error : null}
        {...textFieldProps}
      >
        {selectList.map((selectItem: any) => (
          <MenuItem key={selectItem.id} value={selectItem.id}>
            {selectItem.name}
          </MenuItem>
        ))}
      </TextField>
    </div>
  );
};
