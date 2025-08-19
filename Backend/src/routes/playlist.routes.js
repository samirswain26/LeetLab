import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  addProblemstoPlaylist,
  createPlaylist,
  deletePlaylist,
  getAllListDetails,
  getPlayListDetails,
  removeProblemFromPlaylist,
} from "../controller/playlist.controller.js";

const playlistRoutes = express.Router();

playlistRoutes.post("/create-playlist", authMiddleware, createPlaylist);

playlistRoutes.get("/", authMiddleware, getAllListDetails);

playlistRoutes.get("/:playlistId", authMiddleware, getPlayListDetails);

playlistRoutes.post(
  "/:playlistId/add-problem",
  authMiddleware,
  addProblemstoPlaylist
);

playlistRoutes.delete("/:playlistId", authMiddleware, deletePlaylist);

playlistRoutes.delete(
  "/:playlistId/remove-problem",
  authMiddleware,
  removeProblemFromPlaylist
);

export default playlistRoutes;
