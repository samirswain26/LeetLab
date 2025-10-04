import { create } from "zustand";
import { axiosInstance } from "../libs/axios";
import toast from "react-hot-toast";

export const useAction = create((set) => ({
  isDeletingProblem: false,

  delteProblem: async (id) => {
    try {
      set({ isDeletingProblem: true });
      const res = await axiosInstance.delete(`/problems/delete-problem/${id}`);
      console.log("Delete Problem is :", res.data);
      toast.success("Problem Deleted Succesfully");
      toast.success(res.data.message);
    } catch (error) {
      console.log("Error in Deleting Problem : ", error);
      toast.error("Error in Deleting Problem");
    } finally {
      set({ isDeletingProblem: false });
    }
  },
  delteSubscriptionProblem: async (id) => {
    try {
      set({ isDeletingProblem: true });
      const res = await axiosInstance.delete(`/subscription-problems/delete-problem/${id}`);
      console.log("Delete Problem is :", res.data);
      toast.success("Problem Deleted Succesfully");
      toast.success(res.data.message);
    } catch (error) {
      console.log("Error in Deleting Problem : ", error);
      toast.error("Error in Deleting Problem");
    } finally {
      set({ isDeletingProblem: false });
    }
  },
}));
