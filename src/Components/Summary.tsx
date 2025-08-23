import * as React from "react";
import { LoanDetail } from "../types";
import Typography from "@mui/material/Typography";

interface SummaryProps {
  summary: LoanDetail;
}
export const Summary: React.FunctionComponent<SummaryProps> = ({ summary }) => {
  const { begins, ends, loan, balance, interest, principal, payment, rate } = summary;


  let formatter = Intl.NumberFormat('en', { notation: 'compact' });

  return (
    <div>
      <Typography variant="h4">Term Summary</Typography>
      <table>
        <tr>
          <th>Begins</th>
          <th>Ends</th>
          <th>Loan</th>
          <th>Balance</th>
          <th>Interest</th>
          <th>Principal</th>
          <th>Payment</th>
          <th>Rate</th>
        </tr>
        <tr>
          <td style={{ textAlign: "right" }}>{new Date(begins).toLocaleDateString()}</td>
          <td style={{ textAlign: "right" }}>{new Date(ends).toLocaleDateString()}</td>
          <td>{formatter.format(Math.trunc(loan))}</td>
          <td>{balance}</td>
          <td>{interest}</td>
          <td>{formatter.format(Math.trunc(principal))}</td>
          <td>{formatter.format(Math.trunc(payment))}</td>
          <td>{rate}</td>
        </tr>
      </table>
    </div>
  );
};
