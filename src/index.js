import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'

import App from "./App";

const options = {
  position: 'top left',
  timeout: 7000,
  offset: '30px',
  transition: 'scale'
}

const rootElement = document.getElementById("root");
ReactDOM.render(
  <BrowserRouter>
    <Routes>
        <Route index element={
          <AlertProvider template={AlertTemplate} {...options}>
            <App />
          </AlertProvider>
        } />
      </Routes>
  </BrowserRouter>,
  rootElement
);
