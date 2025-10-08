import React, { useEffect, useMemo, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { UsePlayListStore } from "../store/subscriptionPlaylistStore";
import { Link } from "react-router-dom";
import {
  Search,
  CheckCircle,
  ListMusic,
  ChevronLeft,
  ChevronRight,
  Package,
  Loader2,
  TrashIcon,
  Circle,
  AlertTriangle,
} from "lucide-react";

const SubscribedPlaylistProblems = ({ playlistId }) => {
  const { authUser } = useAuthStore();
  const { isLoading, currentPlayList, removeProblemFromPlaylist } =
    UsePlayListStore();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Parent component already does it fetch the data

  // Extract problems array from currentPlayList
  const problems = useMemo(() => {
    if (
      !currentPlayList?.problems ||
      !Array.isArray(currentPlayList.problems)
    ) {
      return [];
    }
    return currentPlayList.problems;
  }, [currentPlayList]);

  const filteredProblems = useMemo(() => {
    if (!search.trim()) return problems;

    const searchLower = search.toLowerCase().trim();
    return problems.filter((item) => {
      // Each item has: {id, playlistId, problemId, createdAt, updatedAt, problem: {...}}
      const problemTitle = item?.problem?.title || "";
      return problemTitle.toLowerCase().includes(searchLower);
    });
  }, [problems, search]);

  // Pagination 
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredProblems.length / itemsPerPage);
  const paginatedProblems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredProblems.slice(start, end);
  }, [filteredProblems, currentPage]);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // Function to get difficulty badge styling
  const getDifficultyBadge = (difficulty) => {
    switch (difficulty) {
      case "EASY":
        return (
          <div className="badge badge-success gap-1">
            <CheckCircle size={12} />
            Easy
          </div>
        );
      case "MEDIUM":
        return (
          <div className="badge badge-warning gap-1">
            <Circle size={12} />
            Medium
          </div>
        );
      case "HARD":
        return (
          <div className="badge badge-error gap-1">
            <AlertTriangle size={12} />
            Hard
          </div>
        );
      default:
        return <div className="badge badge-ghost">Unknown</div>;
    }
  };

  const isAdmin = authUser?.role === "ADMIN";

  const handleDelete = async (problemId) => {
    if (
      window.confirm(
        "Are you sure you want to remove this problem from the playlist?"
      )
    ) {
      await removeProblemFromPlaylist(playlistId, [problemId]);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Show loading state
  if (isLoading && !currentPlayList) {
    return (
      <div className="w-full max-w-6xl mx-auto mt-10 px-4">
        <div className="flex justify-center items-center py-12">
          <Loader2 className="animate-spin h-8 w-8 text-primary" />
          <span className="ml-3 text-base-content/60">Loading playlist...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto mt-10 px-4">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <ListMusic className="w-8 h-8 text-primary" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {currentPlayList?.name || "Problems"}
          </h2>
        </div>
        <p className="text-base-content/70 ml-11">
          {currentPlayList?.description || "Solve the Problems.."}
        </p>
        {problems.length > 0 && (
          <p className="text-sm text-base-content/60 ml-11 mt-1">
            {problems.length} problem{problems.length !== 1 ? "s" : ""} in this
            playlist
          </p>
        )}
      </div>

      {/* Search Bar */}
      <div className="mb-10 w-full">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/40 w-5 h-5" />
          <input
            type="text"
            placeholder="Search Problems by title..."
            className="input input-bordered w-full pl-12 bg-base-200 focus:outline-none focus:border-primary transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {search && (
          <p className="text-sm text-base-content/60 mt-2">
            Found {filteredProblems.length} problem
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
                <th className="w-20">#</th>
                <th>
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Problem Title
                  </div>
                </th>
                <th>Description</th>
                <th className="w-32 text-center">Difficulty</th>
                {isAdmin && <th className="w-32 text-center">Action</th>}
              </tr>
            </thead>
            <tbody>
              {paginatedProblems.length > 0 ? (
                paginatedProblems.map((item, index) => {
                  // item structure: {id, playlistId, problemId, createdAt, updatedAt, problem: {...}}
                  const problem = item.problem;

                  if (!problem) {
                    console.warn("Problem data missing for item:", item);
                    return null;
                  }

                  return (
                    <tr key={item.id} className="hover">
                      <td className="font-medium text-base-content/60">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td>
                        <Link
                          to={`/problem/${problem.id}`}
                          className="font-semibold hover:text-primary transition-colors flex items-center gap-2 group"
                        >
                          <Package className="w-4 h-4 text-primary/60 group-hover:text-primary transition-colors" />
                          {problem.title}
                        </Link>
                      </td>
                      <td>
                        <p className="text-base-content/80 line-clamp-2">
                          {problem.description}
                        </p>
                      </td>
                      <td>
                        <div className="flex justify-center">
                          {getDifficultyBadge(problem.difficulty)}
                        </div>
                      </td>
                      {isAdmin && (
                        <td>
                          <div className="flex justify-center">
                            <button
                              onClick={() => handleDelete(problem.id)}
                              className="btn btn-sm btn-error gap-2"
                              disabled={isLoading}
                              title="Remove problem from playlist"
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
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={isAdmin ? 5 : 4} className="text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <Package className="w-12 h-12 text-base-content/30" />
                      <p className="text-base-content/60 font-medium">
                        {search
                          ? "No problems found"
                          : "No problems in this playlist"}
                      </p>
                      <p className="text-sm text-base-content/40">
                        {search
                          ? "Try adjusting your search criteria"
                          : "Add some problems to get started!"}
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
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            className="btn btn-sm btn-circle"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex gap-1">
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              let page;
              if (totalPages <= 7) {
                page = i + 1;
              } else if (currentPage <= 4) {
                page = i + 1;
              } else if (currentPage >= totalPages - 3) {
                page = totalPages - 6 + i;
              } else {
                page = currentPage - 3 + i;
              }

              return (
                <button
                  key={page}
                  className={`btn btn-sm ${
                    currentPage === page ? "btn-primary" : "btn-ghost"
                  }`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              );
            })}
          </div>

          <button
            className="btn btn-sm btn-circle"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default SubscribedPlaylistProblems;
