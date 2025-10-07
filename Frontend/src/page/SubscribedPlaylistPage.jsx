// import React, { useEffect } from "react";
// import { Loader } from "lucide-react";
// import { UsePlayListStore } from "../store/subscriptionPlaylistStore";
// import { useParams } from "react-router-dom";

// const SubscribedPlaylistPage = () => {
//   const { playlistId } = useParams();
//   const { isLoading, getPlayListDetails, currentPlayList } = UsePlayListStore();

//   useEffect(() => {
//     getPlayListDetails(playlistId);
//   }, [getPlayListDetails, playlistId]);

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
//         Solve the<span className="text-primary">Problems</span><span className="text-secondary"> And Crack Your Dream Jobs </span>
//       </h1>
//       {currentPlayList?.length > 0 ? (
//         // <PremiumProblems problems={problems} />
//         <h1>Hello</h1>
//       ) : (
//         <p className="mt-10 text-center text-lg font-semibold text-gray-500 dark:text-gray-400 z-10 border border-primary px-4 py-2 rounded-md border-dashed">
//           No problems found
//         </p>
//       )}
//     </div>
//   );
// };

// export default SubscribedPlaylistPage;






import React, { useEffect } from "react";
import { Loader } from "lucide-react";
import { UsePlayListStore } from "../store/subscriptionPlaylistStore";
import { useParams } from "react-router-dom";

const SubscribedPlaylistPage = () => {
  const { playlistId } = useParams(); // ✅ Extract ID from URL
  const { isLoading, getPlayListDetails, currentPlayList } = UsePlayListStore();

  useEffect(() => {
    if (playlistId) {
      getPlayListDetails(playlistId); // ✅ Pass the ID to the store function
    }
  }, [getPlayListDetails, playlistId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center mt-10 px-4">
      <div className="absolute top-16 left-0 h-1/3 w-1/3 bg-primary opacity-30 blur-3xl rounded-md button-9"></div>
      <h1 className="text-4xl font-extrabold z-10 text-center">
        Solve the<span className="text-primary">Problems</span>
        <span className="text-secondary"> And Crack Your Dream Jobs </span>
      </h1>
      {currentPlayList?.length > 0 ? (
        <h1>Hello</h1>
      ) : (
        <p className="mt-10 text-center text-lg font-semibold text-gray-500 dark:text-gray-400 z-10 border border-primary px-4 py-2 rounded-md border-dashed">
          No problems found
        </p>
      )}
    </div>
  );
};

export default SubscribedPlaylistPage;
