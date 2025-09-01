import * as React from "react";
import { Calculator } from "./Calculator";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

export interface AppProps {
  style?: React.CSSProperties;
}

export const App: React.FunctionComponent<AppProps> = () => {
  return (
    <div style={{ margin: "20px" }}>
      <Header style={{ paddingBottom: "90px" }} />
      <Calculator />
    </div>
  );
};



export const Header: React.FunctionComponent<AppProps> = ({ style }) => {
  return (
    <div style={style}>
      <Box sx={{ flexGrow: 1 }} position="fixed" width={"100%"}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Amortization Calculator
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
    </div>
  );
};

