const crypto = require("crypto");
const express = require("express");
const User = require("../models/User");

const router = express.Router();

function missingFields(body, fields) {
  return fields.filter((field) => !body[field]);
}

function publicUser(user) {
  return {
    _id: user._id,
    userName: user.userName,
    email: user.email
  };
}

router.post("/register", async (req, res, next) => {
  try {
    const missing = missingFields(req.body, ["userName", "email", "password"]);

    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
        errors: missing
      });
    }

    const email = req.body.email.trim().toLowerCase();
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "email already exists"
      });
    }

    const user = await User.create({
      userName: req.body.userName,
      email,
      password: req.body.password
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: publicUser(user)
    });
  } catch (error) {
    return next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const missing = missingFields(req.body, ["email", "password"]);

    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
        errors: missing
      });
    }

    const email = req.body.email.trim().toLowerCase();
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "email or password is incorrect"
      });
    }

    const passwordMatches = await user.comparePassword(req.body.password);

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "email or password is incorrect"
      });
    }

    const randomString = crypto.randomUUID();
    user.apiKey = `mern-$${user._id}$-$${user.email}$-$${randomString}$`;
    await user.save({ validateBeforeSave: false });

    return res.json({
      success: true,
      message: "Login successfully",
      data: {
        apiKey: user.apiKey,
        user: publicUser(user)
      }
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
