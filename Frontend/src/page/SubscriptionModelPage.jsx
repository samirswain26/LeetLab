import React, { useEffect } from "react";
import { Loader2, ArrowLeft, ShoppingBag } from "lucide-react";
import { UsePlayListStore } from "../store/subscriptionPlaylistStore";
import { useNavigate } from "react-router-dom";
import PremiumPlaylist from "../components/premiumPlaylist";

const SubscriptionModelPage = () => {
  const navigate = useNavigate();
  const { playLists, isLoading, getAllPlayLists } = UsePlayListStore();

  useEffect(() => {
    getAllPlayLists();
  }, [getAllPlayLists]);

  const handleBack = () => navigate(-1);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-400">
        <Loader2 className="size-10 animate-spin mb-4 text-indigo-500" />
        <p className="text-sm">Loading available playlists...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white overflow-hidden">
      {/* Glowing background */}
      <div className="pointer-events-none absolute top-0 left-0 h-[300px] w-[300px] bg-indigo-600 opacity-25 blur-[120px] rounded-full"></div>
      <div className="pointer-events-none absolute bottom-0 right-0 h-[300px] w-[300px] bg-pink-500 opacity-20 blur-[140px] rounded-full"></div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl px-6 py-10">
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
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Buy and{" "}
            <span className="text-indigo-400 drop-shadow-sm">Unlock</span>{" "}
            <ShoppingBag className="inline size-6 text-pink-400 animate-bounce" />{" "}
            <span className="text-pink-500 drop-shadow-sm">Your Own Playlist</span>
          </h1>
          <p className="mt-3 text-gray-400 text-sm md:text-base">
            Access premium curated playlists designed to boost your learning
          </p>
        </div>

        {/* Playlist Section (Fixed height + internal scroll) */}
        <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-2xl shadow-lg p-6 md:p-5 transition-all duration-300 hover:shadow-indigo-500/20">
          <div className="max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
            <PremiumPlaylist playLists={playLists} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModelPage;
