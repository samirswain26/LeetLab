import { useEffect, useMemo, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { UsePlayListStore } from "../store/subscriptionPlaylistStore";
import { Link } from "react-router-dom";
import { handleBuy, fetchPurchase } from "../store/purchase.store";

import {
  Search,
  ShoppingCart,
  CheckCircle,
  ListMusic,
  ChevronLeft,
  ChevronRight,
  Package,
  Loader2,
  TrashIcon,
} from "lucide-react";

const PremiumPlaylist = ({ playLists }) => {
  const { authUser } = useAuthStore();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { isLoading, deletePlayList } = UsePlayListStore();

  const { fetchPurchaseDetails, isPurchaseLoading, purchasedPlaylists } =
    fetchPurchase();

  useEffect(() => {
    if (authUser) {
      fetchPurchaseDetails();
    }
  }, [authUser, fetchPurchaseDetails]);

  // Filter the data according to the data coming from the backend
  const filteredProblems = useMemo(() => {
    return (playLists || []).filter((playLists) =>
      playLists.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [playLists, search]);

  // Pagination for the table data
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredProblems.length / itemsPerPage);
  const paginatedProblems = useMemo(() => {
    return filteredProblems.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredProblems, currentPage]);

  const handleDelete = (id) => {
    deletePlayList(id);
  };

  const isAdmin = authUser?.role === "ADMIN";

  return (
    <div className="w-full max-w-6xl mx-auto mt-10 px-4">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <ListMusic className="w-8 h-8 text-primary" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Premium Playlists
          </h2>
        </div>
        <p className="text-base-content/70 ml-11">
          Explore and purchase curated problem playlists
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-10 w-full max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search playlists by title..."
            className="w-full bg-slate-800/50 text-gray-200 placeholder-gray-500 border border-slate-700 rounded-xl pl-12 pr-4 py-3 
                       focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-400 transition-all duration-200"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {search && (
          <p className="text-sm text-gray-400 mt-2 text-center">
            Found{" "}
            <span className="text-indigo-400 font-semibold">
              {filteredProblems.length}
            </span>{" "}
            playlist
            {filteredProblems.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {/* Table Section */}
      <div className="card bg-base-200 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-lg">
            <thead className="bg-base-300">
              <tr>
                <th className="w-20">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Status
                  </div>
                </th>
                <th>
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Playlist Title
                  </div>
                </th>
                <th>Description</th>
                <th className="w-32 text-center flex items-center">Price</th>
                {isAdmin && <th className="w-32 text-center">Delete</th>}
                <th className="w-32 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProblems.length > 0 ? (
                paginatedProblems.map((playLists) => {
                  const isBuyed = purchasedPlaylists.has(playLists.id);

                  return (
                    <tr key={playLists.id} className="hover">
                      <td>
                        <div className="flex items-center justify-center">
                          {isBuyed ? (
                            <CheckCircle className="w-5 h-5 text-success" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-base-content/20" />
                          )}
                        </div>
                      </td>
                      <td>
                        {isBuyed ? (
                          <Link
                            to={`/playlist/${playLists.id}`}
                            className="font-semibold hover:text-primary transition-colors flex items-center gap-2 group"
                          >
                            <ListMusic className="w-4 h-4 text-primary/60 group-hover:text-primary transition-colors" />
                            {playLists.name}
                          </Link>
                        ) : (
                          <div
                            className="font-semibold text-base-content/60 flex items-center gap-2 cursor-not-allowed"
                            title="Buy this playlist to access"
                          >
                            <ListMusic className="w-4 h-4 text-base-content/40" />
                            {playLists.name}
                          </div>
                        )}
                      </td>
                      <td>
                        <p className="text-base-content/80 line-clamp-2">
                          {playLists.description}
                        </p>
                      </td>
                      <td>
                        <p className="text-base-content/80 line-clamp-2">
                          ₹499
                        </p>
                      </td>
                      {isAdmin && (
                        <td>
                          <div className="flex justify-center">
                            <button
                              onClick={() => handleDelete(playLists.id)}
                              className="btn btn-sm btn-error gap-2"
                              disabled={isLoading}
                            >
                              {isLoading ? (
                                <Loader2 className="animate-spin h-4 w-4" />
                              ) : (
                                <TrashIcon className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      )}
                      <td>
                        <div className="flex justify-center">
                          {isBuyed ? (
                            <button className="btn btn-sm btn-success btn-disabled gap-2">
                              <CheckCircle className="w-4 h-4" />
                              Owned
                            </button>
                          ) : (
                            <button
                              className="btn btn-sm btn-primary gap-2 hover:scale-105 transition-transform"
                              onClick={() => handleBuy(playLists)}
                            >
                              <ShoppingCart className="w-4 h-4" />
                              Buy
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={isAdmin ? 5 : 4} className="text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <Package className="w-12 h-12 text-base-content/30" />
                      <p className="text-base-content/60 font-medium">
                        No playlists found
                      </p>
                      <p className="text-sm text-base-content/40">
                        Try adjusting your search criteria
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 gap-2">
          <button
            className="btn btn-sm gap-2"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="flex items-center gap-2">
            {[...Array(Math.min(5, totalPages))].map((_, idx) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = idx + 1;
              } else if (currentPage <= 3) {
                pageNum = idx + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + idx;
              } else {
                pageNum = currentPage - 2 + idx;
              }

              return (
                <button
                  key={pageNum}
                  className={`btn btn-sm ${
                    currentPage === pageNum ? "btn-primary" : "btn-ghost"
                  }`}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            className="btn btn-sm gap-2"
            disabled={currentPage === totalPages || currentPage > totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default PremiumPlaylist;
