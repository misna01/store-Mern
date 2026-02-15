// import React from 'react';
// import ReactDOM from 'react-dom/client';

// import App from './App';
// import './index.css'

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(<App />);
import React from "react";
import ReactDOM from "react-dom/client";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <PayPalScriptProvider
    options={{
      "client-id": "AWH2JL1Z--Yfa-uw6tLEOzXEM0pqnxtbrEGdfUqDD5JIOPBOtFimR35H16KRLuvziEPoRH0uIHMjZzDL",
      currency: "USD",
      intent: "capture",
    }}
  >
    <App />
  </PayPalScriptProvider>
);
