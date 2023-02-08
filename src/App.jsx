import { useState } from "react";
import "./App.scss";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Auth from "./pages/Auth/Auth";
import Navbar from "./components/Navbar";
import Pagelayout from "./layouts/Pagelayout";
import ProtectedRoutes from "./components/ProtectedRoutes";

function App({}) {
  const [count, setCount] = useState(0);

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
