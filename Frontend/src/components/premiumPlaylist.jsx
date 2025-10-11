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
  const { fetchPurchaseDetails, purchasedPlaylists } = fetchPurchase();

  useEffect(() => {
    if (authUser) fetchPurchaseDetails();
  }, [authUser, fetchPurchaseDetails]);

  const filteredProblems = useMemo(() => {
    return (playLists || []).filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [playLists, search]);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredProblems.length / itemsPerPage);
  const paginatedProblems = filteredProblems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = (id) => deletePlayList(id);
  const isAdmin = authUser?.role === "ADMIN";

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      {/* Header */}
      <div className="mb-4">
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
      <div className="relative mb-5 w-full max-w-2xl mx-auto">
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

      {/* Table Section */}
      <div className="rounded-xl overflow-hidden border border-slate-700 shadow-md">
        <table className="table w-full text-gray-300">
          <thead className="bg-slate-800 text-gray-400">
            <tr>
              <th>Status</th>
              <th>Playlist Title</th>
              <th>Description</th>
              <th>Price</th>
              {isAdmin && <th>Delete</th>}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProblems.length > 0 ? (
              paginatedProblems.map((p) => {
                const isBuyed = purchasedPlaylists.has(p.id);
                return (
                  <tr key={p.id} className="hover:bg-slate-700/50 transition">
                    <td className="text-center">
                      {isBuyed ? (
                        <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-slate-500 mx-auto" />
                      )}
                    </td>
                    <td>
                      {isBuyed ? (
                        <Link
                          to={`/playlist/${p.id}`}
                          className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300"
                        >
                          <ListMusic className="w-4 h-4" />
                          {p.name}
                        </Link>
                      ) : (
                        <div className="flex items-center gap-2 text-gray-400">
                          <ListMusic className="w-4 h-4" />
                          {p.name}
                        </div>
                      )}
                    </td>
                    <td>{p.description || "—"}</td>
                    <td>₹499</td>
                    {isAdmin && (
                      <td className="text-center">
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="btn btn-sm bg-rose-500 hover:bg-rose-600 text-white"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </td>
                    )}
                    <td className="text-center">
                      {isBuyed ? (
                        <button className="btn btn-sm bg-gray-700 text-gray-300 cursor-not-allowed">
                          Owned
                        </button>
                      ) : (
                        <button
                          onClick={() => handleBuy(p)}
                          className="btn btn-sm bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                          <ShoppingCart className="w-4 h-4 mr-1" />
                          Buy
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={isAdmin ? 6 : 5} className="text-center py-12 text-gray-500">
                  No playlists found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 gap-2">
          <button
            className="btn btn-sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={`btn btn-sm ${
                currentPage === i + 1 ? "btn-primary" : "btn-ghost"
              }`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            className="btn btn-sm"
            disabled={currentPage === totalPages}
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
