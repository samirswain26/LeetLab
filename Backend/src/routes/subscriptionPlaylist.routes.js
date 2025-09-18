import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
    addProblemToPlaylist,
  CretaeSubsriptionPlaylist,
  deletePlaylist,
  GetAllPlaylistSubscribedByUser,
  getAllSubscriptionPlaylist,
  getSubsriptionPlaylistDetails,
  RemoveProblemFromPlaylist,
} from "../controller/subscriptionPlaylist.controller.js";

const SubscriptionPlaylist = express.Router();

SubscriptionPlaylist.post(
  "/sub-create-playlist",
  authMiddleware,
  CretaeSubsriptionPlaylist
);
SubscriptionPlaylist.get("/", authMiddleware, getAllSubscriptionPlaylist);
SubscriptionPlaylist.get("/:playlistId", authMiddleware, getSubsriptionPlaylistDetails);
SubscriptionPlaylist.post("/:playlistId/add-problem", authMiddleware, addProblemToPlaylist);
SubscriptionPlaylist.delete("/:playlistId", authMiddleware, deletePlaylist);
SubscriptionPlaylist.post("/:playlistId/remove-problem", authMiddleware, RemoveProblemFromPlaylist);

//
SubscriptionPlaylist.get("/:playlistId", authMiddleware, GetAllPlaylistSubscribedByUser);

export default SubscriptionPlaylist;
