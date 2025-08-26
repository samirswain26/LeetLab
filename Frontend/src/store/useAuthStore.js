import { create } from "zustand";
import { axiosInstance } from "../libs/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSignUp: false,
  isLoggingIn: false,
  ischeckingAuth: false,

  checkAuth: async () => {
    set({ ischeckingAuth: true });
    try {
      const res = await axiosInstance.get("/auth/check");
      console.log("Check auth res : ", res.data);
      ste({ authUser: res.data.user });
    } catch (error) {
      console.log("Error in checking Auth : ", error);
      set({ authUser: null });
    } finally {
      set({ ischeckingAuth: null });
    }
  },

  SignUp: async (data) => {
    set({ isSignUp: true });
    try {
      const res = await axiosInstance.post("/auth/register", data);
      console.loh("User Signin Up : ", res.data);
      set({ isSignUp: res.data.user });
      toast.success(res.data.message);
    } catch (error) {
      console.log("Error in signup :  ", error);
      toast.error("Error in Signup in");
    } finally {
      set({ isSignUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      console.log("Loggin data is : ", res.data);
      set({ isLoggingIn: res.data.user });
      toast.success(res.data.message);
    } catch (error) {
      console.log("Error in logging in : ", error);
      toast.error("Error in logging you in");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  Logout: async () => {
    try {
      const res = await axiosInstance.post("/auth/logout");
      console.log("Log out data is : ", res.data);
      set({ authUser: null });
      toast.message("User logged out successfully");
    } catch (error) {
      console.log("Error in logout : ", error);
      toast.error("Error in logout");
    }
  },
}));
