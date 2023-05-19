import React from "react";
import { InvestmentIndex, InvestmentIndexProvider } from "./investmentIndex";


export const Investments = () => {
  return (
    <>
      <h3 className="card-title d-print-none">Investments</h3>
      <div className="card-body">
        <InvestmentIndexProvider>
          <InvestmentIndex />
        </InvestmentIndexProvider>
      </div>
    </>
  );
};
