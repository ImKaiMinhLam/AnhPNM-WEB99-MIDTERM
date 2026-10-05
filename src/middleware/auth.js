const User = require("../models/User");

function readApiKey(req) {
  return req.query.apiKey || req.headers["x-api-key"] || req.body.apiKey;
}

async function authenticateApiKey(req, res, next) {
  try {
    const apiKey = readApiKey(req);

    if (!apiKey) {
      return res.status(401).json({
        success: false,
        message: "apiKey is required"
      });
    }

    const user = await User.findOne({ apiKey });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "apiKey is invalid or cannot be authenticated"
      });
    }

    req.authUser = user;
    return next();
  } catch (error) {
    return next(error);
  }
}

module.exports = authenticateApiKey;
