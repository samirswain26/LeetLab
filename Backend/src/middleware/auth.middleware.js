import jwt from "jsonwebtoken";
import { db } from "../Libs/db.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized - No token found.",
      });
    }

    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
        message: "Unauthorized - Invalid token.",
      });
    }

    const user = await db.user.findUnique({
      where: {
        id: decoded.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error Authentication user : ", error);
    res.status(500).json({ message: "Error authenticating user." });
  }
};

export const checkAdmin = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        role: true,
      },
    });
    if (!user || user.role !== "ADMIN") {
      return res.status(403).json({
        message: "Access Denied - Admins Only.",
      });
    }

    next();
  } catch (error) {
    console.log("Error checking admin role : ", error);
    res.status(500).json({ message: "Error checking admin role." });
  }
};

export const authenticateToken = async (req, res, next) => {
  const token = req.headers.autherization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access denied" });
  }
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid token" });
  }
};

export const purchased = async (req, res, next) => {
  try {
    const { playlistId } = req.params;

    const playlist = await db.SubscriptionPlaylist.findUnique({
      where: { id: playlistId },
    });

    if (!playlist) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    if (req.user.role === "ADMIN") {
      return next();
    }

    const purchase = await db.SubscriptionPurchase.findUnique({
      where: {
        userId_playlistId: {
          userId: req.user.id,
          playlistId: playlistId,
        },
      },
    });

    if (!purchase || purchase.status !== "SUCCESS") {
      return res.status(403).json({
        error: "You must purchase this playlist to access it.",
      });
    }

    next();
  } catch (error) {
    console.log("error in purchase middleware:", error);
    res.status(500).json({
      message: "Error in checking purchase list middleware",
    });
  }
};
