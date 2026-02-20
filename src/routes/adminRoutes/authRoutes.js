import express from "express";
import {
  createOrUpdateAuthModule,
  getModuleFeatures
} from "../../controllers/authController/authController.js";

import { authenticateUser, authorizeRoles } from '../../middleware/authorization.js';

const router = express.Router();

router.post("", authenticateUser,authorizeRoles('admin'), createOrUpdateAuthModule);
router.get("/:clientId/:moduleName", authenticateUser,authorizeRoles('admin'), getModuleFeatures);

export default router;
