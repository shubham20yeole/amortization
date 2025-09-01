import * as React from "react";
import { LoanDetail } from "../types";
import Typography from "@mui/material/Typography";

interface SummaryProps {
  summary: LoanDetail;
  title?: string
}
export const Summary: React.FunctionComponent<SummaryProps> = ({ summary, title }) => {
  const { begins, ends, loan, balance, interest, principal, payment, rate } = summary;


  let formatter = Intl.NumberFormat('en', { notation: 'compact' });

  return (
    <>
      <Typography variant="h4">{title || "Term Summary"}</Typography>
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
          <td>{formatter.format(Math.trunc(balance))}</td>
          <td>{formatter.format(Math.trunc(interest))}</td>
          <td>{formatter.format(Math.trunc(principal))}</td>
          <td>{formatter.format(Math.trunc(payment))}</td>
          <td>{rate}</td>
        </tr>
      </table>
    </>
  );
};
