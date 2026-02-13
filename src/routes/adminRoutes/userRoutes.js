import express from 'express';
import { authenticateUser, authorizeRoles } from '../../middleware/authorization.js';
import {
  addClient,
  login,
  getAllClients,
  updateClient,
  updateClientStatusService,
  deleteClientService,
  resetAdminPassword
} from '../../controllers/authController.js/authController.js';
// import { validate, clientRegisterSchema, clientLoginSchema } from "../../validators/user/userValidation.js";

const router = express.Router();


router.post('/register', addClient);

router.post('/login', login);

router.get('/users', authenticateUser, authorizeRoles('admin'), getAllClients);

router.put('/user/:id', authenticateUser, authorizeRoles('admin'), updateClient);

router.put( "/reset-password",authenticateUser, authorizeRoles('admin'), resetAdminPassword);

router.patch('/user-status/:id', authenticateUser, authorizeRoles('admin'), updateClientStatusService);

router.delete('/user/:id', authenticateUser, authorizeRoles('admin'), deleteClientService);

export default router;
