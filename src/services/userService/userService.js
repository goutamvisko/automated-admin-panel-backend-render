import { generateApiKey, generateSecretKey } from "../../utils/helper.js";
import { services } from "../index.js";
import bcrypt from "bcrypt";

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



export const adminLoginService = async ({ email, password }) => {
  const admin = await userService.findOne(
    { email, role: "admin", status: "active" },
    { select: "+password" },
  );

  if (!admin) throw new Error("Invalid credentials");

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) throw new Error("Invalid credentials");

  return admin;
};

export const resetAdminPasswordService = async ({ adminId, newPassword }) => {
  const admin = await userService.findOne({
    _id: adminId,
    role: "admin",
    status: "active",
  });

  if (!admin) throw new Error("Admin not found");

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await userService.updateById(adminId, {
    password: hashedPassword,
  });

  return true;
};

export const fetchClients = async ({ page, limit, status, name,role }) => {
  const filters = {};
  if (status) filters.status = status;
  if (role === "admin") {
    filters.role = { $ne: "admin" }; 
  }

  return userService.findAll({
    filters,
    search: name,
    searchFields: ["name"],
    page,
    limit,
    projection: {
      name: 1,
      dbUri: 1,
      apiKey: 1,
      secretKey: 1,
      role: 1,
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
