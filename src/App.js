import React from "react";
import Products from "./Components/ProductsList";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Products />} />
      </Routes>
      {/*Instead of routing I would have used simple code block , but ................... */}
    </Router>
  );
}

export default App;
