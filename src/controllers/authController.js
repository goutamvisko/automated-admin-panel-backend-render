import {
  createClient,
  loginClient,
  fetchClients,
  updateClientInfo,
  updateClientStatus,
  deleteClient,
} from "../services/auth/authService.js";

import { successResponse, errorResponse } from "../utils/response.js";
import { generateToken } from "../utils/helper.js";

export const registerClient = async (req, res) => {
  try {
    const { name, dbUri } = req.body;

    const { client, apiKey, secretKey } = await createClient({ name, dbUri });

    return successResponse(
      res,
      "Client registered successfully",
      {
        clientId: client._id, 
        name: client.name,
        dbUri: client.dbUri,
        apiKey,
        secretKey,
      },
      201
    );
  } catch (err) {
    return errorResponse(res, err.message || "Registration failed", 400);
  }
};

export const clientLogin = async (req, res) => {
  try {
    const { apiKey } = req.body;

    const client = await loginClient({ apiKey });

    const tokenPayload = {
      userId: client._id, 
      role: client.role,
    };

    const token = generateToken(tokenPayload);

    return successResponse(res, "Login successful", {
      clientId: client._id,
      name: client.name,
      dbUri: client.dbUri,
      apiKey: client.apiKey,
      secretKey: client.secretKey,
      token,
    });
  } catch (err) {
    return errorResponse(res, err.message || "Login failed", 401);
  }
};

export const getAllClients = async (req, res) => {
  try {
    const { page, limit, status, name } = req.query;

    const data = await fetchClients({ page, limit, status, name });

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
