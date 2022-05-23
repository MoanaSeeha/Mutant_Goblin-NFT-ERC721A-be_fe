import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <BrowserRouter>
    <Routes>
        <Route index element={<App />} />
      </Routes>
  </BrowserRouter>,
  rootElement
);
