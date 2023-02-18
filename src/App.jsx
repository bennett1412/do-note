import React from "react";
import "./App.scss";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Auth from "./pages/Auth/Auth";
import Pagelayout from "./layouts/Pagelayout";
import ProtectedRoutes from "./components/ProtectedRoutes";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route element={<Pagelayout />}>
          <Route path="/auth" element={<Auth />} />
          <Route element={<ProtectedRoutes />}>
            <Route path="/" element={<Home />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
