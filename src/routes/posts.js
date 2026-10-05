const express = require("express");
const mongoose = require("mongoose");
const authenticateApiKey = require("../middleware/auth");
const Post = require("../models/Post");

const router = express.Router();

router.post("/", authenticateApiKey, async (req, res, next) => {
  try {
    const { userId, content } = req.body;

    if (!userId || !content) {
      return res.status(400).json({
        success: false,
        message: "userId and content are required"
      });
    }

    if (String(req.authUser._id) !== String(userId)) {
      return res.status(403).json({
        success: false,
        message: "userId does not match authenticated user"
      });
    }

    const post = await Post.create({ userId, content });

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: post
    });
  } catch (error) {
    return next(error);
  }
});

router.put("/:id", authenticateApiKey, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: "post does not exist"
      });
    }

    if (!content) {
      return res.status(400).json({
        success: false,
        message: "content is required"
      });
    }

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "post does not exist"
      });
    }

    if (String(post.userId) !== String(req.authUser._id)) {
      return res.status(403).json({
        success: false,
        message: "You can update only your own post"
      });
    }

    post.content = content;
    await post.save();

    return res.json({
      success: true,
      message: "Post updated successfully",
      data: post
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
