import { LineChart } from "@mui/x-charts";
import moment from "moment";
import { AmortizationCalculator } from "../Controller/AmortizationCalculator";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
export const Graph: React.FunctionComponent<{ controller: AmortizationCalculator }> = ({ controller }) => {

  return <Box sx={{ flexGrow: 1 }}>
    <Grid container spacing={2}>
      <Grid size={5}>
        <InterestGraph controller={controller} />
      </Grid>
      <Grid size={6}>
        <LoanGraph controller={controller} />
      </Grid>
    </Grid>
  </Box>
}


export const InterestGraph: React.FunctionComponent<{ controller: AmortizationCalculator }> = ({ controller }) => {
  const allPayments = controller.state?.loan?.loans?.map((loan) => loan.monthlyPayments)?.flat();
  const interests = allPayments?.map(({ interest }) => interest);
  const payments = allPayments?.map(({ payment }) => payment);
  const principals = allPayments?.map(({ principal }) => principal);
  const begins = allPayments?.map(({ begins }) => begins);
  const breakEvenMonth = allPayments.find(({ principal, interest }) => Math.abs(principal - interest) <= 50)?.begins;

  const margin = { right: 24 };

  const xLabels = begins.map((date) => moment(new Date(date)).format("yyyy/MM")).sort();
  return (
    <div style={{ width: "900px" }}>
      {/* <h3>Break even at: {moment(new Date(breakEvenMonth as number)).format("LL")}</h3> */}
      <LineChart
        height={300}
        series={[
          { data: interests, label: 'Interest' },
          { data: principals, label: 'Principal' },
          { data: payments, label: 'Payment' },
        ]}
        xAxis={[{ scaleType: 'point', data: xLabels }]}
        yAxis={[{ width: 50 }]}
        margin={margin}
      />
    </div>
  );
}

export const LoanGraph: React.FunctionComponent<{ controller: AmortizationCalculator }> = ({ controller }) => {
  const allPayments = controller.state?.loan?.loans?.map((loan) => loan.monthlyPayments)?.flat();
  const balances = allPayments?.map(({ balance }) => balance);
  const loans = allPayments?.map(({ loan }) => loan);
  const payments = allPayments?.map(({ payment }) => payment);
  const begins = allPayments?.map(({ begins }) => begins);
  const margin = { right: 24 };

  const xLabels = begins.map((date) => moment(new Date(date)).format("yyyy/MM")).sort();
  return (
    <div style={{ width: "900px" }}>
      <LineChart
        height={300}
        series={[
          { data: balances, label: 'Balance' },
          { data: loans, label: 'Principal' },
          { data: payments, label: 'Payments' },
        ]}
        xAxis={[{ scaleType: 'point', data: xLabels }]}
        yAxis={[{ width: 50 }]}
        margin={margin}
      />
    </div>
  );
}