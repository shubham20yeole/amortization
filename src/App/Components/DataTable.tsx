import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';

export default function DataTable({ rows = [], columns = [] }: { rows?: object[], columns?: string[]  }) {
    const newColumns = columns.map((column) => ({
        field: column,
        headerName: column,
        flex: 1,
    }));

  return (
    <Paper sx={{ height: 400, width: '600px' }}>
      <DataGrid
        rows={rows}
        columns={newColumns}
        initialState={{ pagination: { paginationModel:  { page: 0, pageSize: 5 } } }}
        pageSizeOptions={[5, 10]}
        sx={{ border: 0 }}
      />
    </Paper>
  );
}