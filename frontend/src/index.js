import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App";
import Success from "./Success";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <BrowserRouter>
    <Routes>
        <Route index element={<App />} />
        <Route path='success' element={<Success/>}/>
      </Routes>
  </BrowserRouter>,
  rootElement
);
