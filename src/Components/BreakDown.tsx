import * as React from "react";
import { AmortizationCalculator } from "../Controller/AmortizationCalculator";
import { LoanDetails, LoanTerm } from "../types";
import { Summary } from "./Summary";
import { GenerateTable } from "./GenerateTable";
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from "@mui/material/Typography";
import { Worth } from "./Worth";


interface BreakDownProps {
    controller: AmortizationCalculator
}

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: (theme.vars ?? theme).palette.text.secondary,
    ...theme.applyStyles('dark', {
        backgroundColor: '#1A2027',
    }),
}));

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
                    <>
                        <Grid size={3}>
                            <Item>
                                <Summary summary={refinance} />
                                <Worth controller={controller} index={index} />
                                <Typography variant="h5">BreakDown</Typography>
                                <GenerateTable rows={mappedRow(refinance.monthlyPayments)} />
                            </Item>
                        </Grid>
                    </>))}
            </Grid>

        </div>
    );
};