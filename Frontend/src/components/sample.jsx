<tbody>
  {paginatedProblems.length > 0 ? (
    paginatedProblems.map((problem) => {
      const isSolved = problem.solvedBy.some(
        (user) => user.userId === authUser?.id
      );
      return (
        <tr key={problem.id}>
          <td>
            <input
              type="checkbox"
              checked={isSolved}
              readOnly
              className="checkbox checkbox-sm"
            />
          </td>
          <td>
            <Link
              to={`/problem/${problem.id}`}
              className="font-semibold hover:underline"
            >
              {problem.title}
            </Link>
          </td>
          <td>
            <div className="flex flex-wrap gap-1">
              {(problem.tags || []).map((tag, idx) => (
                <span
                  key={idx}
                  className="badge badge-outline badge-warning text-xs font-bold"
                >
                  {tag}
                </span>
              ))}
            </div>
          </td>
          <td>
            <span
              className={`badge font-semibold text-xs text-white ${
                problem.difficulty === "EASY"
                  ? "badge-success"
                  : problem.difficulty === "MEDIUM"
                  ? "badge-warning"
                  : "badge-error"
              }`}
            >
              {problem.difficulty}
            </span>
          </td>
          <td>
            <div className="flex flex-col md:flex-row gap-2 items-start md:items-center">
              {authUser?.role === "ADMIN" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDelete(problem.id)}
                    className="btn btn-sm btn-error"
                  >
                    <TrashIcon className="w-4 h-4 text-white" />
                  </button>
                  <button disabled className="btn btn-sm btn-warning">
                    <PencilIcon className="w-4 h-4 text-white" />
                  </button>
                </div>
              )}
              <button
                className="btn btn-sm btn-outline flex gap-2 items-center"
                onClick={() => handleAddToPlaylist(problem.id)}
              >
                <Bookmark className="w-4 h-4" />
                <span className="hidden sm:inline">Save to Playlist</span>
              </button>
            </div>
          </td>
        </tr>
      );
    })
  ) : (
    <tr>
      <td colSpan={5} className="text-center py-6 text-gray-500">
        No problems found.
      </td>
    </tr>
  )}
</tbody>;
