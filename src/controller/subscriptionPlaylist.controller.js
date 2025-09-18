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
    console.log("Playlist Id is : ", playlistId)

    const playlist = await db.SubscriptionPlaylist.findUnique({
      where: {
        id: playlistId,
        // userId: req.user.id,
        createdByRole: "ADMIN"
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

export const addProblemToPlaylist = async (req, res) => {};
export const deletePlaylist = async (req, res) => {};
export const RemoveProblemFromPlaylist = async (req, res) => {};

//
export const GetAllPlaylistSubscribedByUser = async (req, res) => {};
