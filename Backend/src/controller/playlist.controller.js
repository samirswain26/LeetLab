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
      include:{
        problems:{
            include:{
                problem: true
            }
        }
      }
    });

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

export const getPlayListDetails = async (req, res) => {};

export const addProblemstoPlaylist = async (req, res) => {};

export const deletePlaylist = async (req, res) => {};

export const removeProblemFromPlaylist = async (req, res) => {};
