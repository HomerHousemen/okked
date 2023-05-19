/** @format */

import React from "react";
import NumberFormat from "react-number-format";

export const PhoneMask = (props: any) => {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      isNumericString
      format="(###) ###-####"
    />
  );
};
