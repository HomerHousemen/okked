import React from "react";
import { Checkbox, FormControlLabel } from "@material-ui/core";
import { useForm } from "./formProvider";

type CheckboxTypes = {
  onValidate?: (v: any) => any;
  name: string;
  label?: string;
  checkboxProps?: {};
};

export const CheckboxField: React.FC<CheckboxTypes> = ({
  name,
  label,
  checkboxProps,
}) => {
  const form = useForm();
  const value = form.getValue(name);

  return (
    <div className="input-field">
      <FormControlLabel
        control={
          <Checkbox
            onBlur={(_e) => form.setDirty(name)}
            checked={value || false}
            onChange={(event) => {
              form.setValue(name, event.target.checked);
            }}
            color="primary"
          />
        }
        label={label}
        {...checkboxProps}
      />
    </div>
  );
};
