import React from "react";
import { useAuthStore } from "../store/useAuthStore";

export const LogoutButton = ({ children }) => {
  const { Logout } = useAuthStore();

  const onLogout = async () => {
    await Logout();
  };

  return (
    <button className="btn btn-primary" onClick={onLogout}>
      {children}
    </button>
  );
};
