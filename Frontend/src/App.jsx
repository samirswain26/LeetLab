import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./page/HomePage.jsx";
import LoginPage from "./page/LoginPage.jsx";
import SignUpPage from "./page/SignUpPage.jsx";

const App = () => {
  let auth = null;

  return (
    <div className="flex flex-col items-center justify-start">
      <Routes>
        <Route
          path="/"
          element={auth ? <HomePage /> : <Navigate to={"/login"} />}
        />
      </Routes>
      <Routes>
        <Route
          path="/login"
          element={!auth ? <LoginPage /> : <Navigate to={"/"} />}
        />
      </Routes>
      <Routes>
        <Route
          path="/signup"
          element={!auth ? <SignUpPage /> : <Navigate to={"/"} />}
        />
      </Routes>
    </div>
  );
};

export default App;
