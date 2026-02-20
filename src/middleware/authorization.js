import User from "../models/user/userModel.js";
import jwt from "jsonwebtoken";
import envConfig from '../config/env.config.js';

export const authenticateUser = async (req, res, next) => {
  try {
    let token;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        status: false,
        statusCode: 401,
        message: "Access denied. No token provided.",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, envConfig.JWT_SECRET);
      console.log("Decoded Token:", decoded);
    } catch (jwtError) {
      if (jwtError.name === "TokenExpiredError") {
        return res.status(401).json({
          status: false,
          statusCode: 401,
          message: "Token expired. Please login again.",
        });
      }
      if (jwtError.name === "JsonWebTokenError") {
        return res.status(401).json({
          status: false,
          statusCode: 401,
          message: "Invalid token.",
        });
      }
      throw jwtError;
    }

    if (!decoded.userId) {
      return res.status(401).json({
        status: false,
        statusCode: 401,
        message: "Invalid token payload.",
      });
    }

    const user = await User.findByPk(decoded.userId);
    if (!user) {
      return res.status(404).json({
        status: false,
        statusCode: 404,
        message: "User not found.",
      });
    }

    req.user = {
      userId: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role,
    };

    console.log("Authenticated User:", req.user);

    next();
  } catch (error) {
    console.error("Authentication Error:", error);
    return res.status(500).json({
      status: false,
      statusCode: 500,
      message: "Internal server error during authentication.",
      error: envConfig.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        status: false,
        statuscode: 401,
        message: "Unauthorized",
      });
    }

    console.log("Allowed Roles:", allowedRoles);
    console.log("User Role:", req.user.role);

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        status: false,
        statuscode: 403,
        message: "not authorized to access this resource",
      });
    }

    next();
  };
};
