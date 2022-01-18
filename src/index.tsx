import React from "react";
import ReactDOM from "react-dom";
// import './index.css';
import HydraClientApp from "./App";
import * as dotenv from 'dotenv';

dotenv.config();
//import reportWebVitals from './reportWebVitals';
// import { HydraAdmin } from "@api-platform/admin";
// const Admin = () => <HydraAdmin entrypoint="http://localhost:8080/api" />
ReactDOM.render(
  <React.StrictMode>
    <HydraClientApp />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
