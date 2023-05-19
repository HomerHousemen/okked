import React from "react";
import {createNumberMask} from "text-mask-addons";
import MaskedInput from "react-text-mask";

const moneyMaskSettings = createNumberMask({
  prefix: "",
  allowDecimal: true,
  decimalLimit: 2,
  integerLimit: 10,
});

export const MoneyMask = (props: any) => {
  const { inputRef, ...other } = props;
  return (
    <MaskedInput
      {...other}
      ref={(ref: any) => {
        inputRef(ref ? ref.inputElement : null);
      }}
      mask={moneyMaskSettings}
      placeholderChar={"0"}
      guide={false}
      showMask
    />
  );
};
