import * as React from "react";
import { Calculator } from "./Calculator";
export interface AppProps {}

export const App: React.FunctionComponent<AppProps> = () => {
    return (
        <div style={{margin: "20px"}}>
          <Calculator />
        </div>
    );
};
