import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

type GenerateTableProps = {
    rows: object[];
}
export const GenerateTable: React.FunctionComponent<GenerateTableProps> = ({ rows }) => {
    const keys = rows && rows.length && Object.keys(rows[0])
    return keys && (
        <div>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 10 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        {keys.map((key) => {
                            return <TableCell align="right">{key}</TableCell>
                        })}
                    </TableRow>
                </TableHead>
                <TableBody>
                {rows?.map((row) => {
                    return (
                        <TableRow>
                            {Object.values(row).map((value) => {
                                return (
                                    <TableCell align="right">{value}</TableCell>
                                )
                            })}
                        </TableRow>

                    )
                })}
                </TableBody>
            </Table>
            </TableContainer>
        </div>
        
    );
};