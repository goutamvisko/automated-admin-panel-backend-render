import crypto from "crypto";
import { generateApiKey, generateSecretKey } from "../../utils/helper.js";
import { services } from "../index.js";

const userService = services.user;
export const createClient = async ({ name, dbUri }) => {
  const existingClient = await userService.findOne({ dbUri });
  if (existingClient) throw new Error("Client already exists");

  const { apiKey, hashedApiKey } = generateApiKey();
  const { secretKey, hashedSecretKey } = await generateSecretKey();

  const client = await userService.create({
    name,
    dbUri,
    apiKey: hashedApiKey,
    secretKey: hashedSecretKey,
  });

  return { client, apiKey, secretKey };
};

export const loginClient = async ({ apiKey }) => {
  const apiKeyHash = crypto
    .createHash("sha256")
    .update(apiKey)
    .digest("hex");

  const client = await userService.findOne({
    apiKey: apiKeyHash,
    status: "active",
  });

  if (!client) throw new Error("Invalid apiKey");

  return client;
};

export const fetchClients = async ({ page, limit, status, name }) => {
  const filters = {};
  if (status) filters.status = status;

  return userService.findAll({
    filters,
    search: name,
    searchFields: ["name"],
    page,
    limit,
    projection: {
      name: 1,
      dbUri: 1,
      status: 1,
      createdAt: 1,
    },
  });
};

export const updateClientInfo = async (id, { name, dbUri }) => {
  const client = await userService.updateById(id, { name, dbUri });
  if (!client) throw new Error("Client not found");
  return client;
};

export const updateClientStatus = async (id, status) => {
  const client = await userService.updateById(id, { status });
  if (!client) throw new Error("Client not found");
  return client;
};

export const deleteClient = async (id) => {
  const client = await userService.deleteById(id);
  if (!client) throw new Error("Client not found");
  return client;
};
