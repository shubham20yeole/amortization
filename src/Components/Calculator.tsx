import * as React from "react";
import { BreakDown } from "./BreakDown";
import { AmortizationCalculator } from "../Controller/AmortizationCalculator";
import { Summary } from "./Summary";
import { Refinance, RefinanceParams, Refresh } from "./Refinance";
import { useState } from "react";
import { Graph } from "./Graph";
import Typography from "@mui/material/Typography";

export interface CalculatorViewProps {
  controller: AmortizationCalculator;
  refresh: Refresh;
}

export const Calculator: React.FunctionComponent = () => {
  const [controller, setController] = useState<AmortizationCalculator>(new AmortizationCalculator())


  const refresh = (loanAmount: number, refinances: RefinanceParams[]) => {
    const newController = new AmortizationCalculator();
    refinances.filter(({ checked }) => checked).forEach(({ rate, begins }) => {
      const newLoanAmount = newController.getRemainingBalanceByDate(begins);
      newController.addRefinance({ loan: newLoanAmount || loanAmount, rate, begins })
    })
    setController(newController);
  }

  return (
    <div>
      {controller && <CalculatorView controller={controller} refresh={refresh} />}
    </div>
  );
};


export const CalculatorView: React.FunctionComponent<{ controller: AmortizationCalculator, refresh: Refresh }> = ({ controller, refresh }) => {
  return controller && (<>
      <Typography variant="h2">Amortization Calculator</Typography>
      <Refinance controller={controller} refresh={refresh} />
      <Graph controller={controller} />
      <Summary summary={controller.getSummary()} />
      <BreakDown controller={controller} />
    </>
  );
};



