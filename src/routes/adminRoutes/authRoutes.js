import express from "express";
import {
  createOrUpdateAuthModule,
} from "../../controllers/moduleController/moduleController.js";

import { authenticateUser, authorizeRoles } from '../../middleware/authorization.js';

const router = express.Router();

router.post("/auth", authenticateUser,authorizeRoles('admin'), createOrUpdateAuthModule);


export default router;