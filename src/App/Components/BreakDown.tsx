import * as React from "react";
import { AmortizationCalculator } from "/Users/shubham.yeole/code/amortization/src/App/Controller/AmortizationCalculator";
import { Summary } from "./Summary";
import { GenerateTable } from "/Users/shubham.yeole/code/amortization/src/App/Components/GenerateTable";
import Grid from '@mui/material/Grid';
import { Worth } from "/Users/shubham.yeole/code/amortization/src/App/Components/Worth";
import { LoanDetails, LoanTerm } from "App/types";


interface BreakDownProps {
    controller: AmortizationCalculator
}

export const BreakDown: React.FunctionComponent<BreakDownProps> = ({ controller }) => {
    const refinances: LoanTerm[] = controller.state.loan.loans;

    const mappedRow = (loanDetails: LoanDetails): object[] => {
        return loanDetails.map(loanDetail => {
            const obj = {
                "Payment Date": new Date(loanDetail.begins).toLocaleDateString(),
                "Payment": Math.trunc(loanDetail.payment),
                "Interest": Math.trunc(loanDetail.interest),
                "Principal": Math.trunc(loanDetail.principal),
                "Balance": Math.trunc(loanDetail.balance),
                "Loan": Math.trunc(loanDetail.loan),
            }
            return obj;
        })
    }
    return controller && (
        <div>
            <Grid container spacing={2}>
                {refinances.map((refinance, index) => (
                    <Grid size={5}>
                        <Summary summary={refinance} />
                        <Worth controller={controller} index={index} />
                        <GenerateTable rows={mappedRow(refinance.monthlyPayments)} />
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};