import * as React from 'react';
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