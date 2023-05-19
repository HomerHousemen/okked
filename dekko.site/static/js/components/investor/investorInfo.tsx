import React from "react";
import { InvestorRecord, FormProvider } from "@dekko/common";
import { InvestorInfoForm } from "./investorInfo/investorInfoForm";

interface Props {
  investor: InvestorRecord;
}

export const InvestorInfo = ({ investor }: Props) => {
  if (!investor.id) return null;

  return (
    <FormProvider initialValues={investor}>
      <InvestorInfoForm />
    </FormProvider>
  );
};
