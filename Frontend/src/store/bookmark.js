import { create } from "zustand";
import { axiosInstance } from "../libs/axios";
import toast from "react-hot-toast";

export const usebookMarkStore = create((set, get) => ({
  bookmark: [],
  currentbookMark: null,
  isLoading: false,
  error: null,

  addbooMark: async (problemId) => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.post(`/add/book-mark/${problemId}`);
      console.log("Add Book Mark resposne is : ", res.data);
      set({bookmark: res.data})
      toast.success("Problem added to Bookmark");
    } catch (error) {
      console.log("Error in adding problem into the playlist");
      toast.error(error.response?.data?.error || "Failed to add bookmark");
    } finally {
      set({ isLoading: false });
    }
  },

  getallBookmarks: async () => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.get("/add/");
      console.log("Res data getting bookmark is :", res.data);
      set({ currentbookMark: res.data.Bookmark });
    } catch (error) {
      console.log("Error in fetching bookmark list :", error);
      toast.error(
        error?.response?.data?.error || "Failed to fetch Bookmarl list"
      );
    } finally {
      set({ isLoading: false });
    }
  },

  removeBookmark: async (id) => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.delete(`/add/remove-BookMark/${id}`);
      console.log("Remove bookmark is :", res.data);
      toast.success(res?.data?.message || "Bookmark removed");
    } catch (error) {
      console.log("Error in removing Bookmark :", error);
      toast.error(res?.data?.message || "Failed to remove Bookmark");
    }
  },
}));
