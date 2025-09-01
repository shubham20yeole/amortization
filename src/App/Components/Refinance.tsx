import * as React from "react";
import { AmortizationCalculator } from "../Controller/AmortizationCalculator";
import moment from "moment";
import dayjs from 'dayjs';
import { useState } from "react";
import Switch from '@mui/material/Switch';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
export type Refresh = (loanAmount: number, refinances: RefinanceParams[]) => void;
export interface RefinanceProps {
  controller: AmortizationCalculator;
  refresh: Refresh;
}

export interface RefinanceParams {
  begins: number;
  rate: number;
  uuid?: string;
  checked?: boolean;
}

export const Refinance: React.FunctionComponent<RefinanceProps> = ({ refresh }) => {
  const [loanAmount, setLoanAmount] = useState<number>(936000)
  const [beginDate, setBeginDate] = useState<number>(new Date("August 1, 2024").getTime())
  const [beginRate, setBeginRate] = useState<number>(6.375)
  const uuid = crypto.randomUUID();
  const [refinances, setRefinances] = useState<RefinanceParams[]>([{ begins: beginDate, rate: beginRate, uuid, checked: true }]);

  const refinance = () => {
    const uuid = crypto.randomUUID();
    const lastRefinance = refinances[refinances.length - 1];
    const lastRefinanceDate = lastRefinance?.begins as number;
    const lastRefinanceRate = lastRefinance?.rate as number;
    const newDate = new Date(lastRefinanceDate);
    newDate.setMonth(newDate.getMonth() + 12);
    setRefinances([...refinances, { rate: lastRefinanceRate - 0.125, begins: newDate.getTime(), uuid, checked: true }])
  }

  React.useEffect(() => {
    refresh(loanAmount, refinances)
  }, [loanAmount, refinances]);

  React.useEffect(() => {
    onUpdateRefinanceInfo({ uuid, rate: beginRate, begins: beginDate }, true)
  }, [beginDate, beginRate]);

  const toggleRefinance = (id: string) => {
    const updatedRefinances = refinances.map((refinance) => {
      if (refinance.uuid === id) {
        return {
          ...refinance,
          checked: !refinance.checked
        }
      }
      return refinance;
    });
    setRefinances([...updatedRefinances])
  }

  const onUpdateRefinanceInfo = (newRefinanceInfo: RefinanceParams, defaultLoan = false) => {
    if (defaultLoan) {
      const newInfo = refinances;
      newInfo[0] = { ...newRefinanceInfo, checked: newInfo[0]?.checked };
      setRefinances([...newInfo]);
      return;
    }
    const newRefinances: RefinanceParams[] = refinances.map(({ rate, begins, uuid, checked }) => {
      if (uuid === newRefinanceInfo.uuid) {
        return { ...newRefinanceInfo, checked }
      }
      return { rate, begins, uuid, checked };

    }) as RefinanceParams[]
    setRefinances([...newRefinances])
  }
  return (
    <><Box component="section" sx={{ p: 2, border: '1px dashed grey' }}>
      <Typography variant="h5">Loan Details</Typography>
      <Grid container spacing={2}>
        <Grid size={3}>
          <TextField type="number" label="Loan Amount" variant="outlined" value={loanAmount} onChange={(event) => setLoanAmount(Number(event.target.value))} />
        </Grid>
        <Grid size={3}>
          <TextField type="number" label="Rate" variant="outlined" value={beginRate} onChange={(event) => setBeginRate(Number(event.target.value))} />
        </Grid>
        <Grid size={3}>
          <TextField label="Loan start" variant="outlined" value={moment(new Date(beginDate)).toString()} onChange={(event) => setBeginDate(Number(event.target.value))} disabled />
        </Grid>
      </Grid>
    </Box>
      <Box component="section" sx={{ p: 2, border: '1px dashed grey' }}>
        <Typography variant="h5">Refinances</Typography>
        {refinances.map(({ begins, rate, uuid, checked }) => (
          <Grid container spacing={2} key={uuid} margin={2}>
            <Grid size={3}>
              <Switch checked={checked} onChange={() => toggleRefinance(uuid as string)} />
            </Grid>
            <Grid size={3}>
              <TextField type="number" label="Rate" value={rate} variant="outlined" onChange={(event) => {
                onUpdateRefinanceInfo({ rate: Number(event.target.value as string), begins, uuid })
              }} />
            </Grid>
            <Grid size={3}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker label={'Refinance Month'} views={['month', 'year']}
                  value={dayjs(new Date(begins))}
                  onChange={(newValue) => {
                    const newDate = newValue?.format("MM/DD/YYYY") as string;
                    const time = new Date(newDate).setDate(1);
                    onUpdateRefinanceInfo({ begins: time || 0, rate, uuid })
                  }} />
              </LocalizationProvider>
            </Grid>

          </Grid>
        ))}
        <Button size="large" onClick={refinance}>Add Refinance</Button>
      </Box></>
  );
};

