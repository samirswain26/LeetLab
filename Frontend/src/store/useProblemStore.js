import { create } from "zustand";
import { axiosInstance } from "../libs/axios";
import { toast } from "react-hot-toast";

export const useProblemStore = create((set) => ({
  problems: [],
  problem: null,
  solvedProblems: [],
  isProblemsLoading: false,
  isProblemLoading: false,

  getAllProblems: async () => {
    try {
      set({ isProblemsLoading: true });

      const res = await axiosInstance.get("/problems/get-all-problems");
      console.log("Get all problem data is : ", res);
      set({ problems: res.data.problems });

    } catch (error) {
      console.log("Error getting all problems", error);
      toast.error("Error in getting problems");
    } finally {
      set({ isProblemsLoading: false });
    }
  },

  getProblemById: async (id) => {
    try {
      set({ isProblemLoading: true });

      const res = await axiosInstance.get(`/problems/get-problem/${id}`);

      set({ problem: res.data.problem });
      toast.success(res.data.message);
    } catch (error) {
      console.log("Error in getting the problem :", error);
      toast("Error in getting the problems");
    } finally {
      set({ isProblemLoading: false });
    }
  },

  getSolvedProblemByUser: async () => {
    try {
      const res = await axiosInstance.get("/problems/get-solved-problems");
      set({ solvedProblems: res.data.problems });
    } catch (error) {
      console.log("Error in getting solved problem by the user:", error);
      toast(res.data.message || "Error in getting solved problem by the user");
    }
  },
}));
