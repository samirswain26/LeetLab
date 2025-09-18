import { db } from "../Libs/db.js";

export const CretaeSubsriptionPlaylist = async (req, res) => {
  const { name, description } = req.body;

  if (req.user.role !== "ADMIN") {
    return res.status(403).json({
      error: "You are not allowed to create a Playlist.",
    });
  }

  try {
    if (!name && !description) {
      return res.status(400).json({
        error: "Name and description is required",
      });
    }

    const checkName = await db.SubscriptionPlaylist.findUnique({
      where: {
        name_userId: {
          name,
          userId: req.user.id,
        },
      },
    });

    if (checkName) {
      return res.status(400).json({
        error: "Playlist Name already exists",
      });
    }

    const playlist = await db.SubscriptionPlaylist.create({
      data: {
        name,
        description,
        userId: req.user.id,
        createdByRole: "ADMIN", // mark as ADMIN playlist
      },
    });

    res.status(200).json({
      success: true,
      message: "PlayList created successfully",
      playlist,
    });
  } catch (error) {
    console.log("Error in creating playlist :", error);
    res.status(500).json({
      error: "Error in creating playlist",
    });
  }
};

export const getAllSubscriptionPlaylist = async (req, res) => {
  try {
    const playlist = await db.SubscriptionPlaylist.findMany({
      where: {
        createdByRole: "ADMIN", //Only Admin created playlist the user can only get
      },
      include: {
        problems: {
          include: {
            problem: true,
          },
        },
      },
    });

    if (!playlist) {
      res.status(404).json({
        error: "Playlists not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Get all playlists",
      playlist,
    });
  } catch (error) {
    console.log("Error in get all playlist :", error);
    res.status(500).json({
      error: "Error in getting playlists",
    });
  }
};

export const getSubsriptionPlaylistDetails = async (req, res) => {
  try {
    const { playlistId } = req.params;
    console.log("Playlist Id is : ", playlistId);

    const playlist = await db.SubscriptionPlaylist.findUnique({
      where: {
        id: playlistId,
        createdByRole: "ADMIN",
      },
      include: {
        problems: {
          include: {
            problem: true,
          },
        },
      },
    });

    if (!playlist) {
      return res.status(404).json({
        error: "Playlists not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Get playlist details",
      playlist,
    });
  } catch (error) {
    console.log("Error in fetching the playlist details :", error);
    res.status(500).json({
      error: "Error in Fetching the playlist details",
    });
  }
};

export const addProblemToPlaylist = async (req, res) => {
  const { playlistId } = req.params;
  const { problemIds } = req.body;
  try {
    const playlist = await db.SubscriptionPlaylist.findUnique({
      where: {
        id: playlistId,
        createdByRole: "ADMIN",
      },
    });

    if (!playlist) {
      return res.status(404).json({
        error: "Playlists not found",
      });
    }
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        error: "You are not allowed to add problem to the Playlist.",
      });
    }

    let problemsArray = [];

    if (Array.isArray(problemIds)) {
      problemsArray = problemIds;
    } else if (typeof problemIds === "string") {
      problemsArray = [problemIds]; // wrap single id in array
    } else {
      return res.status(400).json({
        error: "Invalid problemIds format",
      });
    }

    for (const problemId of problemsArray) {
      const problem = await db.SubscriptionProblem.findUnique({
        where: { id: problemId },
      });

      if (!problem) {
        return res.status(404).json({
          error: `Problem id not found`,
        });
      }
    }

    if (!Array.isArray(problemIds) || problemIds.length === 0) {
      res.status(400).json({
        error: "Invalid or missing problem",
      });
    }

    const existingProblems = await db.ProblemInSubscriptionPlaylist.findMany({
      where: {
        playlistId,
        problemId: { in: problemsArray },
      },
    });

    if (existingProblems.length > 0) {
      return res.status(400).json({
        error: "Some problems already exist in the playlist",
        existingProblemIds: existingProblems.map((p) => p.problemId),
      });
    }

    //create record in the playlists

    const problemsInPlaylist =
      await db.ProblemInSubscriptionPlaylist.createMany({
        data: problemIds.map((problemId) => ({
          playlistId,
          problemId,
        })),
      });

    res.status(201).json({
      success: true,
      message: "Problem added to the playlist successfully",
      problemsInPlaylist,
    });
  } catch (error) {}
};

export const deletePlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params;

    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        error: "You are not allowed to delete the Playlist.",
      });
    }

    const playlist = await db.SubscriptionPlaylist.findUnique({
      where: {
        id: playlistId,
        createdByRole: "ADMIN",
      },
    });

    if (!playlist) {
      return res.status(404).json({
        error: "Playlists not found",
      });
    }

    const deletePlaylist = await db.SubscriptionPlaylist.delete({
      where: {
        id: playlistId,
        createdByRole: "ADMIN",
      },
    });

    res.status(200).json({
      success: true,
      message: "Play list deleted successfully",
      deletePlaylist,
    });
  } catch (error) {
    console.log("Error in deleting playlist :", error);
    res.status(500).json({
      error: "Error in deleting playlist",
    });
  }
};

export const RemoveProblemFromPlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const { problemIds } = req.body;

    if (!Array.isArray(problemIds) || problemIds.length === 0) {
      res.status(400).json({ error: "Invalid or missing problemId" });
    }

    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        error: "You are not allowed to delete the problem from the playlist.",
      });
    }

    const deleteProblem = await db.ProblemInSubscriptionPlaylist.deleteMany({
      where: {
        playlistId,
        problemId: {
          in: problemIds,
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Problem reoved from the playlist",
      deleteProblem,
    });
  } catch (error) {
    console.log("Error in deleting problem :", error);
    res.status(500).json({
      error: "Error in deleting problem",
    });
  }
};

//
export const GetAllPlaylistSubscribedByUser = async (req, res) => {};
