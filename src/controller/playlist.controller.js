import { db } from "../Libs/db.js";

export const createPlaylist = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.id;
    console.log(name);

    const playlist = await db.playlist.create({
      data: {
        name,
        description,
        userId,
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

export const getAllListDetails = async (req, res) => {
  try {
    const userId = req.user.id;

    const playlist = await db.playlist.findMany({
      where: {
        userId: userId,
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

export const getPlayListDetails = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const playlist = await db.playlist.findUnique({
      where: {
        id: playlistId,
        userId: req.user.id,
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

export const addProblemstoPlaylist = async (req, res) => {
  const { playlistId } = req.params;
  const { problemIds } = req.body;
  try {
    console.log("Play list id is", playlistId);
    console.log("Problem id is :", problemIds);
    console.log("type of problemIds is:-", typeof problemIds);
    console.log("Type of Playlist is :", typeof playlistId);

    const checkpalylist = await db.playlist.findUnique({
      where: {
        id: playlistId,
      },
    });
    if (!checkpalylist) {
      res.status(404).json({
        error: "Playlist not found.",
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
      const problem = await db.problem.findUnique({
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

    const existingProblems = await db.ProblemInPlaylist.findMany({
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

    const problemsInPlaylist = await db.ProblemInPlaylist.createMany({
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
  } catch (error) {
    console.log("Error in add problems to the playlist :", error);
    res.status(500).json({
      error: "Error in add problems to the playlist",
    });
  }
};

export const deletePlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params;

    const findPlaylist = await db.Playlist.findUnique({
      where: {
        id: playlistId,
      },
    });

    if (!findPlaylist) {
      res.status(404).json({
        error: "Play list not found",
      });
    }

    const deletePlaylist = await db.playlist.delete({
      where: {
        id: playlistId,
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

export const removeProblemFromPlaylist = async (req, res) => {};
