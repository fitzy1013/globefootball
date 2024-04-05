import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./MainPage";

const RoutesComponent = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={"/"} element={<MainPage/>} />
      </Routes>
    </BrowserRouter>
  );
};

export default RoutesComponent;