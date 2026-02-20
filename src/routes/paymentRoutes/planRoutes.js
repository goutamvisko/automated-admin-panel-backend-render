import express from "express";
import {
  createPlan,
  getPlans,
  updatePlan,
  deletePlan,
} from "../../controllers/paymentController/planController.js";

import { authenticateUser, authorizeRoles } from '../../middleware/authorization.js';

const router = express.Router();

router.post("/", authenticateUser,authorizeRoles('admin'), createPlan);

router.get("/:clientId",authenticateUser,authorizeRoles('admin'),  getPlans);

router.put("/:clientId/:planId", authenticateUser,authorizeRoles('admin'), updatePlan);

router.delete("/:clientId/:planId", authenticateUser,authorizeRoles('admin'), deletePlan);

export default router;
