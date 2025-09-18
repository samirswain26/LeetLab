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

    const playlist = await db.SubscriptionPlaylist.create({
      data: {
        name,
        description,
        userId: req.user.id,
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

export const getAllSubscriptionPlaylist = async (req, res) => {};
export const getSubsriptionPlaylistDetails = async (req, res) => {};
export const addProblemToPlaylist = async (req, res) => {};
export const deletePlaylist = async (req, res) => {};
export const RemoveProblemFromPlaylist = async (req, res) => {};

//
export const GetAllPlaylistSubscribedByUser = async (req, res) => {};
