import User from "../models/user/userModel.js";
import jwt from "jsonwebtoken";
import envConfig from "../config/env.config.js";

export const authenticateUser = async (req, res, next) => {
  try {
    let token;

    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        status: false,
        message: "Access denied. No token provided.",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, envConfig.JWT_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          status: false,
          message: "Token expired. Please login again.",
        });
      }

      return res.status(401).json({
        status: false,
        message: "Invalid token.",
      });
    }

    if (!decoded.userId) {
      return res.status(401).json({
        status: false,
        message: "Invalid token payload.",
      });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found.",
      });
    }
    if (user.status !== "active") {
      return res.status(403).json({
        status: false,
        message: "Account is inactive",
      });
    }

    req.user = {
      userId: user._id,
      email: user.email,
      role: user.role,
      status: user.status,
    };

    next();
  } catch (error) {
    console.error("Authentication Error:", error);

    return res.status(500).json({
      status: false,
      message: "Internal server error during authentication.",
    });
  }
};

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        status: false,
        message: "Unauthorized access. User role not found.",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        status: false,
        message: "Not authorized to access this resource",
      });
    }

    next();
  };
};
