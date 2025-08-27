import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const layout = () => {
  return (
    <div>
        <Navbar />
        <Outlet />
    </div>
  );
};

export default layout;
