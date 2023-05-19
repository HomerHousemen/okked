import React from "react";
import { InvestorIndex } from "./investorIndex/investorIndex";
import { InvestorIndexProvider } from "./investorIndex/investorIndexProvider";

export const Investors = () => {
  return (
    <>
      <h3 className="card-title d-print-none">Investors</h3>
      <InvestorIndexProvider>
        <InvestorIndex />
      </InvestorIndexProvider>
    </>
  );
};
