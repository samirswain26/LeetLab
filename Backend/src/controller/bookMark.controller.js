import { db } from "../Libs/db.js";

export const bookMark = async (req, res) => {
  try {
    const { problemId } = req.params;
    const userId = req.user.id;

    console.log("req user id is: ", req.user.id);

    if (!problemId) {
      return res.status(400).json({
        message: "Problem id is required",
      });
    }

    const findProblem = await db.problem.findUnique({
      where: {
        id: problemId,
      },
    });

    if (!findProblem) {
      return res.status(404).json({
        message: "Problem not found!",
      });
    }

    const existingBookMark = await db.BookMarked.findUnique({
      where: {
        userId_problemId: {
          userId,
          problemId,
        },
      },
    });

    if (existingBookMark) {
      return res.status(400).json({
        message: "Problem alreay in the bookmarked list",
      });
    }

    const newBookMark = await db.BookMarked.create({
      data: {
        userId,
        problemId,
      },
    });

    res.status(200).json({
      success: true,
      message: "Problem Bookmarked",
      Bookmark: newBookMark,
    });
  } catch (error) {
    console.log("Error in bookMarking", error);
    res.status(500).json({
      success: false,
      message: "Error in Bookmarking",
    });
  }
};

export const getBookmarlList = async (req, res) => {
  try {
    const userId = req.user.id;
    const getBookMarkList = await db.BookMarked.findMany({
      where: {
        userId,
      },
      include: {
        problem: true,
      },
    });

    if (getBookMarkList.length === 0) {
      return res.status(404).json({
        message: "No problems in the Bookmark list",
      });
    }

    res.status(200).json({
      success: true,
      message: "BookMark list",
      data: getBookMarkList,
    });
  } catch (error) {
    console.log("error in get bookmark list : ", error);
    res.status(500).json({
      message: "Error in getting the Bookmark List",
    });
  }
};

export const removeBookmark = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const findBookMark = await db.BookMarked.findUnique({
      where: {
        id,
      },
    });

    if (!findBookMark) {
      return res.status(404).json({
        message: "BookMark list not found",
      });
    }

    await db.BookMarked.delete({
      where: {
        id,
      },
    });

    res.status(200).json({
      success: true,
      message: "Bookmark removed",
    });
  } catch (error) {
    console.log("Error in removing book mark :", error);
    res.status(500).json({
      success: false,
      message: "Error in removing Bookmark",
    });
  }
};
