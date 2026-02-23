import {
  createClient,
  adminLoginService,
  fetchClients,
  updateClientInfo,
  updateClientStatus,
  deleteClient,
  resetAdminPasswordService
} from "../../services/userService/userService.js";

import { successResponse, errorResponse } from "../../utils/response.js";
import { generateToken } from "../../utils/helper.js";
import Client from "../../models/user/userModel.js";
export const addClient = async (req, res) => {
  try {
    const { name, dbUri } = req.body;
    if(!name || !dbUri){
      return errorResponse(res, "Name and DB URI are required", 400);
    }
    const { client, apiKey, secretKey } = await createClient({ name, dbUri });

    return successResponse(
      res,
      "Client registered successfully",
      {
        clientId: client._id, 
        role: client.role,
        name: client.name,
        dbUri: client.dbUri,
        apiKey,
        secretKey,
      },
      201
    );
  } catch (err) {
    console.error("Registration error:", err);
    return errorResponse(res, err.message || "Registration failed", 400);
  }
};

export const adminLogin = async (req, res) => {
  try {
    let user;

    if (req.body.email && req.body.password) {
      user = await adminLoginService(req.body);
    } 

    const token = generateToken({
      userId: user._id,
      role: user.role,
    });

    return successResponse(res, "Login successful", {
      userId: user._id,
      name: user.name,
      role: user.role,
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    return errorResponse(res, err.message || "Login failed", 401);
  }
};

export const validateClient = async (req, res) => {
  try {
    const { apiKey, secretKey } = req.body;

    if (!apiKey || !secretKey) {
      return res.status(400).json({ message: "apiKey & secretKey required" });
    }

    const client = await Client.findOne({ apiKey, secretKey }).lean();

    if (!client) {
      return res.status(401).json({ message: "Invalid API credentials" });
    }

    const match = await bcrypt.compare(secretKey, client.secretKey);
    if (!match) {
      return res.status(401).json({ message: "Invalid API credentials" });
    }
    if (client.status !== "active") {
      return res.status(403).json({ message: "Client inactive" });
    }

    res.json({
      clientId: client._id,
      clientName: client.name,
      role: client.role,
      dbUri: client.dbUri,
      status: client.status,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Validation failed" });
  }
};

export const getAllClients = async (req, res) => {
  try {
    const { role } = req.user;
    const { page, limit, status, name } = req.query;

    const data = await fetchClients({ page, limit, status, name ,role});
    return successResponse(res, "Clients fetched successfully", {
      list: data.rows,
      pagination: {
        total: data.count,
        page: data.page,
        limit: data.limit,
        totalPages: data.totalPages,
      },
    });
  } catch (err) {
    return errorResponse(res, err.message || "Failed to fetch clients", 500);
  }
};

export const updateClient = async (req, res) => {
  try {
    const { id } = req.params; 
    const { name, dbUri } = req.body;

    const client = await updateClientInfo(id, { name, dbUri });

    return successResponse(res, "Client updated successfully", {
      id: client._id,
      name: client.name,
      dbUri: client.dbUri,
    });
  } catch (err) {
    return errorResponse(res, err.message || "Failed to update client", 400);
  }
};
export const resetAdminPassword = async (req, res) => {
      console.log("Admin password :", req.body);

  try {
    const adminId = req.user.userId;
    console.log("Admin ID for password reset:", adminId);
    const { newPassword } = req.body;

    if (!newPassword) {
      return errorResponse(res, "New password is required", 400);
    }

    await resetAdminPasswordService({ adminId, newPassword });

    return successResponse(res, "Password updated successfully");
  } catch (err) {
    console.error("Reset password error:", err);
    return errorResponse(res, err.message, 400);
  }
};

export const updateClientStatusService = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const client = await updateClientStatus(id, status);

    return successResponse(res, "Client status updated successfully", {
      id: client._id,
      name: client.name,
      dbUri: client.dbUri,
      status: client.status,
    });
  } catch (err) {
    return errorResponse(res, err.message || "Failed to update client status", 400);
  }
};

export const deleteClientService = async (req, res) => {
  try {
    const { id } = req.params;

    await deleteClient(id);

    return successResponse(res, "Client deleted successfully");
  } catch (err) {
    return errorResponse(res, err.message || "Failed to delete client", 400);
  }
};
