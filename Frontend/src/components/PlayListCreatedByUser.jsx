import React, { useEffect } from "react";
import { UsePlayListStore } from "../store/usePlayListStore";
import { Link } from "react-router-dom";
import { TrashIcon, Loader2, PencilIcon } from "lucide-react";

const PlayListCreatedByUser = () => {
  const { getAllPlayLists, playLists, isLoading, deletePlayList } =
    UsePlayListStore();

  useEffect(() => {
    getAllPlayLists();
    console.log("Get all playlist is : ", getAllPlayLists);
  }, [getAllPlayLists]);

  const handleDelete = async (PlayListId) => {
    deletePlayList(PlayListId);
  };

  return (
    <div className="p-4 bg-base-100">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-primary mb-6">My PlayLists</h2>

        {playLists.length === 0 ? (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="text-lg font-medium">No Playlist yet</h3>
              <p className="text-base-content/70">
                Create playlists to see them listed here!
              </p>
              <div className="card-actions justify-end">
                <Link to="/" className="btn btn-primary">
                  View Problems
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="card bg-base-100 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <td className="bg-base-300">Name</td>
                    <td className="bg-base-300">Description</td>
                    <td className="bg-base-300">Actions</td>
                  </tr>
                </thead>
                <tbody>
                  {playLists.map((playlists) => (
                    <tr key={playlists.id} className="hover">
                      <td className="font-medium"> {playlists.name} </td>
                      <td className="font-medium"> {playlists.description} </td>
                      <td>
                        <button
                          onClick={() => handleDelete(playlists.id)}
                          className="btn btn-sm btn-error"
                        >
                          {isLoading ? (
                            <Loader2 className="animate-spin h-4 w-4" />
                          ) : (
                            <TrashIcon className="w-4 h-4 text-white" />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayListCreatedByUser;
