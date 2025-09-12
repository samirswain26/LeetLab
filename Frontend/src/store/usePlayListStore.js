import { create } from "zustand";
import { axiosInstance } from "../libs/axios";
import toast from "react-hot-toast";

export const UsePlayListStore = create((set, get) => ({
  playLists: [],
  currentPlayList: null,
  isLoading: false,
  error: null,

  createPlaylist: async (PlayListData) => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.post(
        "/Play-List/create-playlist",
        PlayListData
      );
      set((state) => ({
        playLists: [...state.playLists, res.data.playlist],
      }));
      toast.success( res.data?.message || "Playlist created successfully");
      return res.data.playlist;
    } catch (error) {
      console.log("Error creating Playlist", error);
      toast.error(error.response?.data?.error || "Failed to create playlist");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  getAllPlayLists: async () => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.get("/Play-List/");
      set({ playLists: res.data.playlist });
    } catch (error) {
      console.error("Error fetching playlists : ", error);
      toast.error("Failed to fetch playlist");
    } finally {
      set({ isLoading: false });
    }
  },

  getPlayListDetails: async (playlistId) => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.get(`/Play-List/${playlistId}`);
      set({ currentPlayList: res.data.playlist });
    } catch (error) {
      console.log("Error in fetching playlist details :", error);
      toast.error(error?.response?.data?.error || "Failed to fetch playlist details");
    } finally {
      set({ isLoading: false });
    }
  },

  addProblemToPlaylist: async (playlistId, problemIds) => {
    try {
      const res = await axiosInstance.post(
        `/Play-List/${playlistId}/add-problem`,
        {
          problemIds,
        }
      );

      toast.success(res?.data?.message || "Problem added to theplaylist");

      //Refresh the playlist details
      if (get().currentPlayList?.id === playlistId) {
        return get().getAllPlayLists(playlistId);
      } else {
        return "Something went wrong while fetching problem details";
      }
    } catch (error) {
      console.error("Error adding problem to playlist : ", error);
      toast.error( error?.response?.data?.message || "Failed to add problem to the playlist");
    } finally {
      set({ isLoading: false });
    }
  },

  removeProblemFromPlaylist: async (playlistId, problemIds) => {
    try {
      set({ isLoading: true });

      const res = await axiosInstance.delete(
        `/Play-List/${playlistId}/remove-problem`,
        {
          data : {problemIds},
        }
      );
      toast.success(res.data?.message || "Problem removed from playlist");

      
      //Refresh the playlist details
      if(get().currentPlayList?.id === playlistId) {
        return get().getPlayListDetails(playlistId)
      }

     
      
    } catch (error) {
      console.error("Error removing problem from playlist : ", error);
      toast.error("Failed to remove problem from playlist"
      );
    } finally {
      set({ isLoading: false });
    }
  },

  deletePlayList: async (playlistId) => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.delete(`/Play-List/${playlistId}`);

      set((state) => ({
        playLists : state.playLists.filter((p) => p.id !== playlistId)
      }))

      toast.success(res.data?.message || "Playlist deleted successfully.");
    } catch (error) {
      console.error("Error in deleting playlist : ", error);
      toast.error("Error in deleting playlist");
    } finally {
      set({ isLoading: false });
    }
  },
}));
