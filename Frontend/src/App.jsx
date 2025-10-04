import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import HomePage from "./page/HomePage.jsx";
import LoginPage from "./page/LoginPage.jsx";
import SignUpPage from "./page/SignUpPage.jsx";
import { useAuthStore } from "./store/useAuthStore.js";
import { Loader } from "lucide-react";
import Layout from "./layout/layout.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import AddProblem from "./page/AddProblem.jsx";
import ProblemPage from "./page/ProblemPage.jsx";
import ProfilePage from "./page/ProfilePage.jsx";
import ProblemsPage from "./page/ProblemsPage.jsx";
import PlayListDetails from "./page/PlayListDetails.jsx";
import SolvedProblemPage from "./page/SolvedProblemPage.jsx";
import SubscriptionModelPage from "./page/SubscriptionModelPage.jsx";
import AddSubscriptionProblem from "./page/AddSubscriptionProblem.jsx";
import SubscriptionProblemList from "./page/SubscriptionProblemList.jsx";

const App = () => {
  const { authUser, checkAuth, ischeckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (ischeckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start">
      <Toaster />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            index
            path="/"
            element={authUser ? <HomePage /> : <Navigate to={"/login"} />}
          />
        </Route>

        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to={"/"} />}
        />

        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to={"/"} />}
        />
        <Route
          path="/problem/:id"
          element={authUser ? <ProblemPage /> : <Navigate to={"/Login"} />}
        />
        <Route
          path="/Play-List/:id"
          element={authUser ? <PlayListDetails /> : <Navigate to={"/Login"} />}
        />
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to={"/Login"} />}
        />
        <Route
          path="/problems"
          element={authUser ? <ProblemsPage /> : <Navigate to={"/Login"} />}
        />
        <Route
          path="/problems/:id"
          element={authUser ? <SolvedProblemPage /> : <Navigate to={"/Login"} />}
        />
        <Route
          path="/subscription-Model"
          element={authUser ? <SubscriptionModelPage /> : <Navigate to={"/Login"} />}
        />
        <Route element={<AdminRoute />}>
          <Route
            path="/add-problem"
            element={authUser ? <AddProblem /> : <Navigate to={"/"} />}
          />
          <Route
            path="/add-Subscriptions-problem"
            element={authUser ? <AddSubscriptionProblem /> : <Navigate to={"/"} />}
          />
          <Route
            path="/get-Subscription-problems"
            element={authUser ? <SubscriptionProblemList /> : <Navigate to={"/"} />}
          />
        

        </Route>
      </Routes>
    </div>
  );
};

export default App;
