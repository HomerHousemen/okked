import React from "react";
import {createNumberMask} from "text-mask-addons";
import MaskedInput from "react-text-mask";

const percentMaskSettings = createNumberMask({
  prefix: "",
  allowDecimal: true,
  decimalLimit: 7,
  integerLimit: 3,
});

export const PercentMask = (props: any) => {
  const { inputRef, ...other } = props;
  return (
    <MaskedInput
      {...other}
      ref={(ref: any) => {
        inputRef(ref ? ref.inputElement : null);
      }}
      mask={percentMaskSettings}
      placeholderChar={"0"}
      guide={false}
      showMask
    />
  );
};
