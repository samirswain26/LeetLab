import React, { useEffect } from "react";
import { usebookMarkStore } from "../store/bookmark";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";

const BookmarkList = () => {
  const { getallBookmarks, currentbookMark = [], isLoading } = usebookMarkStore();

  useEffect(() => {
    getallBookmarks();
  }, []);

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="mx-auto text-center">
          <Loader2 className="animate-spin w-8 h-8 mx-auto" />
          <p className="mt-2">Loading bookmarks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-base-100">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-primary mb-6">Bookmark Problems</h2>

        {(!Array.isArray(currentbookMark) || currentbookMark.length === 0) ? (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="text-lg font-medium">No Bookmark yet</h3>
              <p className="text-base-content/70">Add problems to Bookmark!</p>
              <div className="card-actions justify-end">
                <Link to="/" className="btn btn-primary">View Problems</Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="card bg-base-100 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th className="bg-base-300">Name</th>
                    <th className="bg-base-300">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {currentbookMark.map((bookmark) => {
                    const problem = bookmark?.problem || {};
                    return (
                      <tr key={bookmark.id} className="hover">
                        <td className="font-medium">{problem.title || "Untitled"}</td>
                        <td className="font-medium">{problem.description || "No description"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookmarkList;
