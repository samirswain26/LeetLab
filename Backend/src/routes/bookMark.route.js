import express from "express"
import { authMiddleware } from "../middleware/auth.middleware.js"
import { bookMark, getBookmarlList, removeBookmark } from "../controller/bookMark.controller.js"

const BookMark = express.Router()

BookMark.post("/book-mark/:problemId",authMiddleware,bookMark)
BookMark.get("/",authMiddleware,getBookmarlList)
BookMark.delete("/remove-BookMark/:id", authMiddleware, removeBookmark)

export default BookMark