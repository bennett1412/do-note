import { useState } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Auth from "./pages/Auth/Auth";
import Navbar from "./pages/Home/components/Navbar";
import Pagelayout from "./layouts/Pagelayout";

function App({}) {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <Routes>
        <Route element={<Pagelayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
