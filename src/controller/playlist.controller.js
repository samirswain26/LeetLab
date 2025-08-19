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

export const addProblemstoPlaylist = async (req, res) => {};

export const deletePlaylist = async (req, res) => {};

export const removeProblemFromPlaylist = async (req, res) => {};
