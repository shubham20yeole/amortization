import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { AmortizationCalculator } from '../Controller/AmortizationCalculator';
import { LoanDetail } from '../types';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';

type WorthProps = {
    controller: AmortizationCalculator,
    index: number;
}
export const Worth: React.FunctionComponent<WorthProps> = ({ controller, index }) => {

    const stashMemory = controller.stashMemory;
    const thisTermInterest = stashMemory.at(index)?.interest as number;
    const previousTermInterest = stashMemory.at(index-1)?.interest as number;
    const delta = thisTermInterest - previousTermInterest;
    let formatter = Intl.NumberFormat('en', { notation: 'compact' });

    const GreenTemplate = () => {
        return <Alert severity="success">
            {`This refinance is worth it-it cuts your total interest from ${formatter.format(previousTermInterest)} to ${formatter.format(thisTermInterest)}, saving you ${formatter.format(Math.abs(delta))} over a 30-year loan term`}
        </Alert>
    }

    const RedTemplate = () => {
        return <Alert severity="warning">
            {`This refinance isn't worth it-it increases your total interest from ${formatter.format(previousTermInterest)} to ${formatter.format(thisTermInterest)}, costing you an extra ${formatter.format(Math.abs(delta))} over a 30-year loan term`}
        </Alert>
    }

    return (
        <div>
            {index !== 0 && (delta < 0 ? <GreenTemplate />: <RedTemplate />)}
        </div>
        
    );
};