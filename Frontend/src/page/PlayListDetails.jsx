import React, { useEffect } from "react";
import { UsePlayListStore } from "../store/usePlayListStore";
import { Link, useParams } from "react-router-dom";
import {
  TrashIcon,
  Loader2,
  PencilIcon,
  Home,
  ChevronRight,
  Clock,
  Users,
  ThumbsUp,
} from "lucide-react";

const PlayListDetails = () => {
  const { id } = useParams();

  const {
    playLists,
    isLoading,
    getPlayListDetails,
    removeProblemFromPlaylist,
    currentPlayList,
  } = UsePlayListStore();

  useEffect(() => {
    getPlayListDetails(id);
  }, [id]);

  if (isLoading || !playLists) {
    <div className="flex items-center justify-center h-screen bg-base-200">
      <div className="card bg-base-100 p-8 shadow-xl">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="mt-4 text-base-content/70">Loading problem...</p>
      </div>
    </div>;
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-base-300 to-base-200 max-w-7xl w-full">
      {isLoading ? (
        <p className="text-center p-6"> Loading Playlist...</p>
      ) : !playLists ? (
        <p>No Playlist Not Found...</p>
      ) : (
        <>
          <nav className="navbar bg-base-100 shadow-lg px-4">
            <div className="flex-1 gap-2">
              <Link
                to={"/profile"}
                className="flex items-center gap-2 text-primary"
              >
                <Home className="w-6 h-6" />
                <ChevronRight className="w-4 h-4" />
              </Link>
              <div className="mt-2">
                <h1 className="text-xl font-bold">{currentPlayList?.name}</h1>
                <div className="flex items-center gap-2 text-sm text-base-content/70 mt-5">
                  <Clock className="w-4 h-4" />
                  <span>
                    Updated{" "}
                    {new Date(currentPlayList?.createdAt).toLocaleString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </span>
                  <span className="text-base-content/30">•</span>
                  <Users className="w-4 h-4" />
                  <span> {currentPlayList?.problems.length} </span>
                </div>
              </div>
            </div>
          </nav>
          <div className="container mx-auto p-5">
            <table className="table table-zebra table-lg bg-base-200 text-base-content" >
              <thead className="bg-base-300" >
                <tr>
                  <th>Name</th>
                </tr>
              </thead>
              <tbody>
                {currentPlayList?.problems?.length > 0 ? (
                  currentPlayList.problems.map((ep) => {
                    return (
                      <tr key={ep?.problem?.id}>
                        <td>
                          <Link
                            // to={`/problem/${ep.problem.id}`}     // It should be the link of answered output not to the question itself.
                            className="font-semibold hover:underline"
                          >
                            {ep.problem?.title}
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-gray-500">
                      No Problems found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default PlayListDetails;
