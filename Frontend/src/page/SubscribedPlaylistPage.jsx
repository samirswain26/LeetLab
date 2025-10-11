import React, { useEffect } from "react";
import { Loader2, ArrowLeft, Sparkles } from "lucide-react";
import { UsePlayListStore } from "../store/subscriptionPlaylistStore";
import { useNavigate, useParams } from "react-router-dom";
import SubscribedPlaylistProblems from "../components/SubscribedPlaylistProblems";

const SubscribedPlaylistPage = () => {
  const navigate = useNavigate();
  const { playlistId } = useParams();
  const { isLoading, getPlayListDetails, currentPlayList } = UsePlayListStore();

  useEffect(() => {
    if (playlistId) {
      getPlayListDetails(playlistId);
    }
  }, [playlistId]);

  const handleBack = () => navigate(-1);

  // Loading screen
  if (isLoading && !currentPlayList) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-400">
        <Loader2 className="size-10 animate-spin mb-4 text-indigo-500" />
        <p className="text-sm">Loading playlist details...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center pt-10 px-6 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white overflow-hidden">
      {/* Soft background glows (non-interactive) */}
      <div className="pointer-events-none absolute top-0 left-0 h-[250px] w-[250px] bg-indigo-600 opacity-25 blur-[120px] rounded-full"></div>
      <div className="pointer-events-none absolute bottom-0 right-0 h-[250px] w-[250px] bg-pink-500 opacity-20 blur-[140px] rounded-full"></div>

      {/* Content Wrapper */}
      <div className="relative z-10 w-full max-w-5xl">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="size-5" />
            <span className="font-medium">Back</span>
          </button>
        </div>

        {/* Heading */}
        <div className="text-center mb-5">
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
            Solve the{" "}
            <span className="text-indigo-400 drop-shadow-sm">Problems</span>{" "}
            <Sparkles className="inline size-6 text-yellow-400 animate-pulse" />{" "}
            and{" "}
            <span className="text-pink-500 drop-shadow-sm">
              Crack Your Dream Job
            </span>
          </h1>
          <p className="mt-3 text-gray-400 text-sm md:text-base">
            Practice curated problems to sharpen your DSA skills 
          </p>
        </div>

        {/* Playlist section */}
        {currentPlayList ? (
          <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-2xl shadow-lg p-6 md:p-2 transition-all duration-300 hover:shadow-indigo-500/20">
            <SubscribedPlaylistProblems playlistId={playlistId} />
          </div>
        ) : (
          <div className="mt-20 text-center text-gray-400">
            <p className="text-lg font-medium border border-dashed border-slate-600 px-6 py-3 rounded-xl">
              No playlist found. Please check your subscription or try again.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscribedPlaylistPage;
