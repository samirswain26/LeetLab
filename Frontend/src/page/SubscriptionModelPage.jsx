// import React from "react";
// import { useEffect } from "react";
// import { UsePlayListStore } from "../store/subscriptionPlaylistStore";
// import { Loader } from "lucide-react";
// import PremiumPlaylist from "../components/premiumPlaylist";

// const SubscriptionModelPage = () => {
//   const { playLists, isLoading, getAllPlayLists } = UsePlayListStore();

//   useEffect(() => {
//     getAllPlayLists();
//   }, [getAllPlayLists]);

//   if (isLoading) {  
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <Loader className="size-10 animated-spin" />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex flex-col items-center mt-10 px-4">
//       <div className="absolute top-16 left-0 h-1/3 w-1/3 bg-primary opacity-30 blur-3xl rounded-md button-9"></div>
//       <h1 className="text-4xl font-extrabold z-10 text-center">
//         Buy And Get  <span className="text-primary"> Your Own Playlist</span>
//       </h1>
//       {playLists.length > 0 ? 
//       (< PremiumPlaylist playLists={playLists} /> )
//       : (
//         <p className="mt-10 text-center text-lg font-semibold text-gray-500 dark:text-gray-400 z-10 border border-primary px-4 py-2 rounded-md border-dashed">
//           No problems found
//         </p>
//       )}
//     </div>
//   );
// };

// export default SubscriptionModelPage;





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

  // Loading screen
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-400">
        <Loader2 className="size-10 animate-spin mb-4 text-indigo-500" />
        <p className="text-sm">Loading available playlists...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center pt-20 px-16 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white overflow-hidden">
      {/* Soft glowing background (non-interactive) */}
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
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Buy and{" "}
            <span className="text-indigo-400 drop-shadow-sm">Unlock</span>{" "}
            <ShoppingBag className="inline size-6 text-pink-400 animate-bounce" />{" "}
            <span className="text-pink-500 drop-shadow-sm">Your Own Playlist</span>
          </h1>
          <p className="mt-3 text-gray-400 text-sm md:text-base">
            Access premium curated playlists designed to boost your learning 🚀
          </p>
        </div>

        {/* Playlist Section */}
        {playLists && playLists.length > 0 ? (
          <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-2xl shadow-lg p-6 md:p-10 transition-all duration-300 hover:shadow-indigo-500/20">
            <PremiumPlaylist playLists={playLists} />
          </div>
        ) : (
          <div className="mt-20 text-center text-gray-400">
            <p className="text-lg font-medium border border-dashed border-slate-600 px-6 py-3 rounded-xl">
              No playlists available at the moment. Please check back later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionModelPage;
