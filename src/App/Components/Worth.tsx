import * as React from 'react';
import { AmortizationCalculator } from '../Controller/AmortizationCalculator';
import Alert from '@mui/material/Alert';

type WorthProps = {
    controller: AmortizationCalculator,
    index: number;
}
export const Worth: React.FunctionComponent<WorthProps> = ({ controller, index }) => {
    const stashMemory = controller.stashMemory;
    const thisTermInterest = stashMemory[index]?.interest as number;
    const previousTermInterest = stashMemory[index - 1]?.interest as number;
    const delta = thisTermInterest - previousTermInterest;
    let formatter = Intl.NumberFormat('en', { notation: 'compact' });

    const GreenTemplate = () => {
        return <Alert severity="success">
            {`This refinance is worth it-it cuts your total interest from ${formatter.format(previousTermInterest)} to ${formatter.format(thisTermInterest)}, saving you ${formatter.format(Math.abs(delta))} over a 30-year loan term`}
        </Alert>
    }

    const RedTemplate = () => {
        return <Alert severity="error">
            {`This refinance isn't worth it-it increases your total interest from ${formatter.format(previousTermInterest)} to ${formatter.format(thisTermInterest)}, costing you an extra ${formatter.format(Math.abs(delta))} over a 30-year loan term`}
        </Alert>
    }

    const NeutralTemplate = () => {
        return <Alert severity="info">
            {`This refinance does not affect the total interest paid over the life of the loan — it remains the same. This is likely from an initial home purchase loan.`}
        </Alert>
    }

    return (
        <div>
            {index === 0 && <NeutralTemplate />}
            {index !== 0 && (delta < 0 ? <GreenTemplate /> : <RedTemplate />)}
        </div>
    );
};