import React from "react";
import "./App.scss";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Auth from "./pages/Auth/Auth";
import Pagelayout from "./layouts/Pagelayout";
import ProtectedRoutes from "./components/ProtectedRoutes";
import OfflineNotes from "./pages/Offline/Offline";

function App() {
  return (
    <>
      <Route path="/auth" element={<Auth />} />
      <Route element={<Pagelayout />}>
        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<Home />} />
        </Route>
        <Route path="/offline" element={<OfflineNotes />} />
      </Route>
    </>
  );
}

export default App;
