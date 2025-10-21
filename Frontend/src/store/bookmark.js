import { create } from "zustand";
import { axiosInstance } from "../libs/axios";
import toast from "react-hot-toast";

export const usebookMarkStore = create((set, get) => ({
  bookmark: [],
  currentbookMark: [],
  isLoading: false,
  error: null,

  addbooMark: async (problemId) => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.post(`/add/book-mark/${problemId}`);
      console.log("Add Book Mark resposne is : ", res.data);
      // Update state with the newly added bookmark

      const newbookmark = res.data?.Bookmark
      if(newbookmark){
        set((state) => ({
          bookmark: [...state.bookmark, res.data.Bookmark],
          currentbookMark: [...state.currentbookMark, res.data.Bookmark],
        }));
        toast.success("Problem added to Bookmark");
      }
      return newbookmark
    } catch (error) {
      console.log("Error in adding problem into the playlist", error);
      toast.error(error?.response?.data?.message || "Failed to add bookmark");
    } finally {
      set({ isLoading: false });
    }
  },

  getallBookmarks: async () => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.get("/add/all");
      console.log("Res data getting bookmark is :", res.data);
      set({ currentbookMark: res.data.Bookmark || [] });
      return res.data.Bookmark;
    } catch (error) {
      console.log("Error in fetching bookmark list :", error);
    } finally {
      set({ isLoading: false });
    }
  },

  removeBookmark: async (id) => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.delete(`/add/remove-BookMark/${id}`);
      console.log("Remove bookmark is :", res.data);
      set((state) => ({
        bookmark: state.bookmark.filter((b) => b.id !== id),
        currentbookMark: state.currentbookMark.filter(
          (b) => b.id !== id
        ),
      }));
      toast.success(res?.data?.message || "Bookmark removed");
      return res.data || {success: true}
    } catch (error) {
      console.log("Error in removing Bookmark :", error);
      toast.error(error?.res?.data?.message || "Failed to remove Bookmark");
    }finally{
      set({isLoading: false})
    }
  },
}));
