import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import DataTable from './DataTable';

type GenerateTableProps = {
    rows: object[];
}
export const GenerateTable: React.FunctionComponent<GenerateTableProps> = ({ rows }) => {
    const keys = rows && rows.length && Object.keys(rows[0])
    rows = rows.map((row, index) => ({ id: index, ...row }));
    return keys && (
        <DataTable rows={rows} columns={keys} />
    );
};